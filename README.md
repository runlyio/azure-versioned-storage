# Azure Versioned Storage Upload

Upload a directory of assets to Azure Blob Storage under a specified version number directory. If the versioned assets have already been uploaded, the upload will be skipped.

## Usage

### Inputs

* `storageSasUrl`: The Blob Service [Shared Access Signature (SAS)](https://docs.microsoft.com/en-us/rest/api/storageservices/delegate-access-with-shared-access-signature) URL.
* `version`: The version of the assets to upload.
* `container`: The blob container to upload assets into.
* `sourceDir`: The source directory of assets to upload.

### Example Workflow

```yaml
name: CDN
on:
  push:
    branches:
    - master

jobs:
  upload:
    name: Upload to Azure Blob Storage
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v1
        with:
          node-version: '12.x'

        # extract the package version as a variable from package.json
      - uses: Saionaro/extract-package-version@v1.1.0
        id: pkg
      
        # build your assets into the dist folder
      - run: npm i
      - run: npm run bundle

        # upload assets to azure storage
      - uses: runlyio/azure-versioned-storage@v1
        with:
          sourceDir: dist
          version: v${{ steps.pkg.outputs.version }}
          container: mycontainername
          storageSasUrl: ${{ secrets.STORAGE_SAS_URL }}
```
