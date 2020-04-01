import fs from "fs";
import path from "path";
import util from "util";

import { BlobServiceClient } from "@azure/storage-blob";

const readDirAsync = util.promisify(fs.readdir);

export default async function upload({
	connectionString,
	version,
	container: containerName,
	sourceDir
}) {
	const blobClient = BlobServiceClient.fromConnectionString(connectionString);

	const container = blobClient.getContainerClient(containerName);

	const exists = await doesVersionExist(container, version);
	if (exists) {
		console.log(`Version ${version} already exists. Skipping upload.`);
		return;
	}

	const files = await readDirAsync(sourceDir).then(files =>
		files.map(filename => ({
			name: path.join(version, filename),
			path: path.join(sourceDir, filename)
		}))
	);

	console.log(`Uploading ${files.length} files...`);
	for (let i = 0; i < files.length; i++) {
		const file = files[i];

		const block = container.getBlockBlobClient(file.name);
		await block.uploadFile(file.path);
		console.log(`Uploaded ${file.name}`);
	}
}

async function doesVersionExist(container, version) {
	for await (const item of container.listBlobsByHierarchy("/")) {
		if (item.kind === "prefix" && item.name === `${version}/`) {
			return true;
		}
	}

	return false;
}
