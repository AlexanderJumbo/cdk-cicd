import { Stage, StageProps } from "aws-cdk-lib"
import { Construct } from "constructs";
import { LambdaStack } from "./LambdaStack";


//* Este stage/etapa contendrá otras pilas CDK
export class PipelineStage extends Stage {
    constructor(scope: Construct, id: string, props: StageProps) {
        super(scope, id, props)

        //* Llamando al stack de LambdaStack
        new LambdaStack(this, 'LambdaStack', {
            stageName: props.stageName
        })

    }
}