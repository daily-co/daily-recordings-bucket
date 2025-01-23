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

# Connecting Daily to s3

This code accomplishes everything from the [store daily call recordings in a custom Amazon S3 bucket](https://docs.daily.co/guides/products/live-streaming-recording/storing-recordings-in-a-custom-s3-bucket) article. The last step is to send a POST request to enable Daily to write to an s3 bucket.

You can find your bucket name and region by searching in the [AWS S3 Console](https://s3.console.aws.amazon.com/s3/buckets).

The role name is found in the [AWS IAM Console](https://us-east-1.console.aws.amazon.com/iamv2/home#/roles).

```bash
curl --request POST \
  --url https://api.daily.co/v1/ \
  --header "Authorization: Bearer $DAILY_API_KEY" \
  --header 'Content-Type: application/json' \
  --data '{
    "properties": {
      "recordings_bucket": {
        "bucket_name": "$AWS_BUCKET_NAME",
        "bucket_region": "us-west-2",
        "assume_role_arn": "arn:aws:iam::1234567890:role/$AWS_ROLE_NAME",
        "allow_api_access": true,
        "allow_streaming_from_bucket": true
      }
    }
  }'
```


## Note

Bucket is created with basic configuration, you may want to configure differently, e.g.

- adding versioning
- encryption keys
- public/private settings
- cors settings

It can be done by modifying the `aws_s3.Bucket` in the [libs](./lib/daily-recordings-bucket-stack.ts).
