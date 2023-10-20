# manage-service-quotas

This repository stores some examples of AWS service quotas monitor. 



## Install
Run **npm ci** to install dependencies.
````
npm ci
````
## Testing 
````
npm t
````

## Package with serverless
````
npm run package
````

## Deploy on AWS with Serverless
You can use this command locally to deploy the service to AWS. 

Before to deploy set the **deploymentBucket > name** property in **serverless.yml**

Note: In order to work, you have to have AWS credentials set.
````
npm run deploy --stage test
````


## Related blog post

https://theindiecoder.cloud/posts/reliability-pillar-manage-service-quotas-and-constraints/