# bulk file uploader

Uploads a directory (non-recusive) to an S3 bucket.

## requirements

AWS credentials with write permissions for S3 available to the sdk (i.e. config file, environment varialbles)

## installation 

`$ npm install -g bulk-file-uploader`

## usage

```
Usage: bfu [command] [options]


Options:

  -V, --version   output the version number
  -r, --reupload  Force reupload of items that exist in S3
  -h, --help      output usage information


Commands:

  upload [dir]  Upload a directory
  config        Configure bfu's AWS settings
```