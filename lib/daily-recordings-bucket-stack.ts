import {
  CfnOutput,
  Stack,
  StackProps,
  Duration,
  aws_s3,
  aws_iam,
} from "aws-cdk-lib";
import { Construct } from "constructs";

export class DailyRecordingBucket extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const bucketName = this.node.tryGetContext("s3bucketName");

    const recordingsBucket = new aws_s3.Bucket(this, "DailyS3Bucket", {
      bucketName: bucketName,
      encryption: aws_s3.BucketEncryption.S3_MANAGED,
      versioned: true,
    });

    const dailySubdomain = this.node.tryGetContext("dailySubdomain");

    const dailyRole = new aws_iam.Role(this, "dailyRole", {
      description: "Role allowing Daily to record to bucket",
      maxSessionDuration: Duration.hours(12),
      assumedBy: new aws_iam.AccountPrincipal("291871421005"),
      externalIds: [dailySubdomain],
    });

    dailyRole.addToPolicy(
      new aws_iam.PolicyStatement({
        effect: aws_iam.Effect.ALLOW,
        actions: [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucketMultipartUploads",
          "s3:AbortMultipartUpload",
          "s3:ListBucketVersions",
          "s3:ListBucket",
          "s3:GetObjectVersion",
          "s3:ListMultipartUploadParts",
        ],
        // Connects the bucket to the role
        resources: [
          recordingsBucket.bucketArn,
          recordingsBucket.arnForObjects("*"),
        ],
      })
    );

    // Outputs are defined below:
    new CfnOutput(this, "bucketName", {
      value: recordingsBucket.bucketName,
      description: "Name of S3 bucket",
      exportName: `${dailySubdomain}-bucketName`,
    });

    new CfnOutput(this, "bucketRegion", {
      value: this.region,
      description: "Region where S3 bucket is located",
      exportName: `${dailySubdomain}-bucketRegion`,
    });

    new CfnOutput(this, "roleArn", {
      value: dailyRole.roleArn,
      description: "ARN of IAM role for Daily to assume",
      exportName: `${dailySubdomain}-roleArn`,
    });
  }
}
