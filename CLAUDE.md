# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AWS CDK (v2) TypeScript project that provisions infrastructure for storing Daily.co call recordings in a custom S3 bucket. Creates an S3 bucket and IAM role that allows Daily's AWS account to write recordings.

## Commands

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Watch mode (recompile on changes)
npm run watch

# Run tests
npm test

# CDK bootstrap (first-time setup)
npx cdk bootstrap --context dailySubdomain=[subdomain] --context s3bucketName=[name] --context s3bucketRegion=[region]

# CDK deploy
npx cdk deploy --context dailySubdomain=[subdomain] --context s3bucketName=[name] --context s3bucketRegion=[region]
```

## Architecture

- **bin/daily-recordings-bucket.ts**: CDK app entry point. Validates three required context parameters: `dailySubdomain`, `s3bucketName`, `s3bucketRegion`.
- **lib/daily-recordings-bucket-stack.ts**: Main CDK stack defining:
  - S3 bucket with S3-managed encryption and versioning enabled
  - IAM role ("dailyRole") that trusts Daily's AWS account (291871421005) with external ID verification using the subdomain
  - CloudFormation outputs: bucketName, bucketRegion, roleArn

The IAM role grants Daily permissions for: PutObject, GetObject, ListBucket, ListBucketMultipartUploads, AbortMultipartUpload, ListBucketVersions, GetObjectVersion, ListMultipartUploadParts.

## Node Version

Node v22 (specified in .nvmrc)

## Documentation

- [Storing recordings in a custom S3 bucket](https://docs.daily.co/guides/products/live-streaming-recording/storing-recordings-in-a-custom-s3-bucket) - Daily.co guide for configuring S3 bucket integration
