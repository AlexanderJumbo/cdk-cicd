import * as cdk from 'aws-cdk-lib';
import { CodeBuildStep, CodePipeline, CodePipelineSource, ShellStep } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { PipelineStage } from './PipelineStage';

export class CdkCicdStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'AwesomePipeline', {
      pipelineName: 'AwesomePipeline',
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('AlexanderJumbo/cdk-cicd', 'master'), // especificamos de donde este pipeline tomará el código fuente
        commands: [
          //'cd cdk-cicd', solo en caso de que el repo sea un folder que contenga varios otros repos
          'npm ci',
          'npx cdk synth'
        ],
        //primaryOutputDirectory: 'cdk-cicd/cdk.out' solo en caso de que el repo sea un folder que contenga varios otros repos
      })
    })

    const testStage = pipeline.addStage(new PipelineStage(this, 'PipelineTestStage', {
      stageName: 'test'
    }))

    //* Ejecutar el test antes del despliegue
    testStage.addPre(new CodeBuildStep('unit-tests', {
      commands: [
        //'cd cdk-cicd',
        'npm ci',
        'npm test'
      ]
    }))

  }
}
