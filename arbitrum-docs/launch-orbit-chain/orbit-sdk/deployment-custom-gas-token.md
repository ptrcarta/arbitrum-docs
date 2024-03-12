---
title: 'Custom Gas Token Orbit Deployment'
sidebar_label: 'Custom Gas Token Orbit Deployment'
description: 'Arbitrum SDK '
author: Mehdi Salehi
sme: Mehdi Salehi
target_audience: 'Developers deploying and maintaining Orbit chains.'
sidebar_position: 3
---
This guide explains how to deploy a `Custom gas token Orbit` chain.

  - <small>If you prefer to learn by code and want to skip the detailed guides, we recommend checking out the "create-rollup-custom-fee-token" <a href="https://github.com/OffchainLabs/arbitrum-orbit-sdk/blob/main/examples/create-rollup-custom-fee-token/index.ts">example</a> in the Orbit SDK repository. It's a practical, step-by-step guide to getting a Custom gas token Orbit chain running from scratch.</small>

### Custom gas token Orbit Deployment

Deploying a Custom Gas Token Orbit chain introduces a unique aspect to the standard Orbit chain setup: the ability to pay transaction fees using a specific `ERC20` token instead of `ETH`. While the setup process largely mirrors that of a standard <a data-quicklook-from="arbitrum-rollup-chain">Rollup Orbit chain</a> (as detailed in the [introduction](introduction.md), there are key differences to account for when configuring a Custom Gas Token Orbit chain.

:::important

As mentioned in the [introduction page](introduction.md), only Anytrust chains can have a custom gas token; it is not possible to have a Rollup Orbit with a custom gas fee token.

:::

#### Key Differences for Custom Gas Token Orbit Chain Deployment

1. **Fee Token Specification:** 

    The most significant difference is the specification of the `ERC20` token on the parent chain to be used as the gas fee token. This requires selecting an existing `ERC20` token or deploying a new one to be used specifically for transaction fees on your Orbit chain.
    
    **Note:** Currently, only `ERC20` tokens with 18 decimals are acceptable as gas tokens on Orbit chains.

2. **Chain Configuration**: When preparing the `chainConfig` using the Orbit SDK, you need to specify the chosen `ERC20` token address as the `nativeToken`. This step is crucial for the system to recognize and use your selected `ERC20` token for transaction fees.
**Note** that, as discussed above, the chain config needs to be set to Anytrust chain type, and `DataAvailabilityCommittee` should be set to `"true"`.

   Example:
   ```js
   import { prepareChainConfig } from '@arbitrum/orbit-sdk';

   const chainConfig = prepareChainConfig({
       chainId: Some_Chain_ID,
       nativeToken: yourERC20TokenAddress,
       DataAvailabilityCommittee: true,
   });
   ```

3. **Token Approval before deployment process**

    In Custom gas token Orbit chains, the owner needs to give allowance to the `rollupCreator` contract before starting the deployment process, so that `RollupCreator` can spend enough tokens for the deployment process. For this purpose we defined two APIs on the Orbit SDK:

   A. `createRollupEnoughCustomFeeTokenAllowance`
   
    This API would get related inputs and checks if the rollupCreator contract has enough Allowance on the token from the owner.
   
    ```js
    import {createRollupEnoughCustomFeeTokenAllowance} from '@arbitrum/orbit-sdk';

    const allowanceParams = {
    nativeToken,
    account: deployer_address,
    publicClient: parentChainPublicClient,
    };

    const enough Allowance = createRollupEnoughCustomFeeTokenAllowance(allowanceParams)
    ```

   B. `createRollupPrepareCustomFeeTokenApprovalTransactionRequest`
   
    This API gets related inputs and creates the transaction request to secure enough Allowance from the owner to the `RollupCreator` to spend `nativeToken` on the deployment process.
    
    Example:
   
    ```js
    import {createRollupEnoughCustomFeeTokenAllowance} from '@arbitrum/orbit-sdk';

    const allowanceParams = {
    nativeToken,
    account: deployer_address,
    publicClient: parentChainPublicClient,
    };

    const approvalTxRequest = await createRollupPrepareCustomFeeTokenApprovalTransactionRequest(
        allowanceParams,
    );
    ```

#### Deployment Process

The overall deployment process, including the use of APIs like `createRollupPrepareConfig` and `createRollupPrepareTransactionRequest`, remains similar to the [Rollup deployment](deployment-rollup.md) process. However, attention must be given to incorporating the `ERC20` token details into these configurations.

**Note:** When using the API, you need to specify `nativeToken` as params as well.

    Example:

```js
const txRequest = await createRollupPrepareTransactionRequest({
    params: {
    config,
    batchPoster,
    validators: [validator],
    nativeToken},
    account: deployer.address,
    publicClient: parentChainPublicClient,
});
```

All other parts would be the same as explained in the [Rollup Orbit chain deployment page](deployment-rollup.md).
