# Daily s3 setup to store recordings

This project provides an example of the cloud infrastructure to store
daily's recordings to an s3 bucket.

## Setup

- Run `npm install`.
- [Setup your AWS credentials](https://docs.aws.amazon.com/sdk-for-java/v1/developer-guide/setup-credentials.html) on your development machine.

## Instructions

- `npx cdk bootstrap --context dailySubdomain=[daily_subdomain] --context s3bucketName=[bucket_name] --context s3bucketRegion=[bucket_region]`
- `npx cdk deploy --context dailySubdomain=[daily_subdomain] --context s3bucketName=[bucket_name] --context s3bucketRegion=[bucket_region]`

The output of the `cdk deploy` command will include the names of the
s3 bucket and the IAM role configured for Daily.
You'll use these to configure your Daily domain and/or rooms for
outputting recordings.

## Note

Bucket is created with basic configuration, you may want to configure differently, e.g.

- adding versioning
- encryption keys
- public/private settings
- cors settings

It can be done by modifying the `aws_s3.Bucket` in the [libs](./lib/daily-recordings-bucket-stack.ts).
