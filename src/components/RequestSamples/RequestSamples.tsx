import { observer } from 'mobx-react';
import * as React from 'react';
import { OperationModel, RedocNormalizedOptions } from '../../services';
import { PayloadSamples } from '../PayloadSamples/PayloadSamples';
import { SourceCodeWithCopy } from '../SourceCode/SourceCode';

import { Tab, TabList, TabPanel, Tabs } from '../../common-elements';
import { OptionsContext } from '../OptionsProvider';

export interface RequestSamplesProps {
  operation: OperationModel;
}

@observer
export class RequestSamples extends React.Component<RequestSamplesProps> {
  static contextType = OptionsContext;
  context: RedocNormalizedOptions;
  operation: OperationModel;

  render() {
    const { operation } = this.props;
    const requestBodyContent = operation.requestBody && operation.requestBody.content;
    const hasBodySample = requestBodyContent && requestBodyContent.hasSample;
    const samples = operation.codeSamples;

    const hasSamples = hasBodySample || samples.length > 0;
    const hideTabList = true;
    return (
      (hasSamples && (
        <div>
          <Tabs defaultIndex={0}>
            <TabList hidden={hideTabList}>
              {hasBodySample && <Tab key="payload"> Payload </Tab>}
              {samples.map(sample => (
                <Tab key={sample.lang + '_' + (sample.label || '')}>
                  {sample.label !== undefined ? sample.label : sample.lang}
                </Tab>
              ))}
            </TabList>
            {hasBodySample && (
              <TabPanel key="payload">
                <div>
                  <PayloadSamples content={requestBodyContent!} />
                </div>
              </TabPanel>
            )}
            {samples.map(sample => (
              <TabPanel key={sample.lang}>
                <SourceCodeWithCopy lang={sample.lang} source={sample.source} />
              </TabPanel>
            ))}
          </Tabs>
        </div>
      )) ||
      null
    );
  }
}
