import * as core from "@actions/core";

import uploadToAzure from "./azure";

async function run() {
	try {
		const version = core.getInput("version");

		if (!version) {
			core.setFailed("Missing required version input.");
			return;
		}

		console.log(`Preparing to upload ${version} assets`);

		await uploadToAzure({
			connectionString: core.getInput("connectionString"),
			version: core.getInput("version"),
			container: core.getInput("container"),
			sourceDir: core.getInput("sourceDir")
		});
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
