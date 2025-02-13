const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const mime = require('mime-types');
const Redis = require('ioredis');

const publisher = new Redis('redis://default:aXNWGwhIZn83p9szq8KuCmf3cZG9Y8a1@redis-16577.c14.us-east-1-3.ec2.redns.redis-cloud.com:16577');

const s3Client = new S3Client({
    region: 'ap-south-1',
    credentials: {
        accessKeyId: 'AKIAQ4NXQIBVVEUWDYZB',
        secretAccessKey: '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'
    }
});

const PROJECT_ID = process.env.PROJECT_ID;

function publishLog(log) {
    publisher.publish(`logs:${PROJECT_ID}`, JSON.stringify({ log }));
}

async function init() {
    console.log('Executing script.js');
    publishLog('Build Started...');
    const outDirPath = path.join(__dirname, 'output');

    // Ensure output folder exists
    if (!fs.existsSync(outDirPath)) {
        fs.mkdirSync(outDirPath, { recursive: true });
    }

    const p = exec(`cd ${outDirPath} && npm install && npm run build`);

    p.stdout.on('data', function (data) {
        console.log(data.toString());
        publishLog(data.toString());
    });

    p.stderr.on('data', function (data) {
        console.log('Error', data.toString());
        publishLog(`error: ${data.toString()}`);
    });

    p.on('close', async function () {
        console.log('Build Complete');
        publishLog('Build Complete');

        const distFolderPath = path.join(__dirname, 'output', 'dist');
        
        // Check if dist folder exists
        if (!fs.existsSync(distFolderPath)) {
            console.log('Error: dist folder does not exist');
            publishLog('Error: dist folder does not exist');
            //process.exit(1); // Exit with error code
        }

        const distFolderContents = fs.readdirSync(distFolderPath, { recursive: true });

        publishLog('Starting to upload');
        for (const file of distFolderContents) {
            const filePath = path.join(distFolderPath, file);
            if (fs.lstatSync(filePath).isDirectory()) continue;

            console.log('uploading', filePath);
            publishLog(`uploading ${file}`);

            const command = new PutObjectCommand({
                Bucket: 'skillhunt-vercel',
                Key: `__outputs/${PROJECT_ID}/${file}`,
                Body: fs.createReadStream(filePath),
                ContentType: mime.lookup(filePath)
            });

            await s3Client.send(command);
            publishLog(`uploaded ${file}`);
            console.log('uploaded', filePath);
        }

        publishLog('Done');
        console.log('Done...');
        process.exit(0); // Exit successfully
    });
}

init();