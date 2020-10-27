import React, { useState } from 'react';
import { Form, Input, Grid } from 'semantic-ui-react';

// import { stringToU8a, u8aToHex } from '@polkadot/util';
import { useSubstrate } from './substrate-lib';
import { TxButton } from './substrate-lib/components';

export default function Main (props) {
  const { api } = useSubstrate();
  const { accountPair } = props;

  const [status, setStatus] = useState(null);
  const [formState, setFormState] = useState({ threshold: null, otherSignatories: null, maybeTimepoint: null, remark: null, storeCall: false, maxWeight: 1000000000 });

  const onChange = (_, data) =>
    setFormState(prev => ({ ...prev, [data.state]: data.value }));

  const { threshold, otherSignatories, maybeTimepoint, remark, storeCall, maxWeight } = formState;

  return (
    <Grid.Column width={14}>
      <h1>Multisig Remark on Chain</h1>
      <Form>
        <Form.Field>Create a <b>new</b> Multisig remark request</Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Threshold'
            type='number'
            placeholder='MAX 16 -- Minimum number of signatories to approve'
            state='threshold'
            onChange={onChange}
          />
        </Form.Field>
        <Form.Field>
          <Input
            fluid
            label='Other Signatories'
            type='text'
            placeholder='AccountIDs able to sign -- ex: "[key1,key2]"'
            state='otherSignatories'
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field>
          <Input
            fluid
            label='Remark'
            type='text'
            placeholder='Any data...'
            state='remark'
            onChange={onChange}
          />
        </Form.Field>

        <Form.Field style={{ textAlign: 'center' }}>
          <TxButton
            accountPair={accountPair}
            label='Submit'
            type='SIGNED-TX'
            setStatus={setStatus}
            attrs={{
              palletRpc: 'multisig',
              callable: 'asMulti',
              inputParams: [threshold, [otherSignatories], maybeTimepoint, api.tx.system.remark(remark), storeCall, maxWeight],
              paramFields: [true, true, { optional: true }, true, true, true]
            }}
          />
        </Form.Field>
        <div style={{ overflowWrap: 'break-word' }}>{status}</div>
      </Form>
    </Grid.Column>
  );
}
