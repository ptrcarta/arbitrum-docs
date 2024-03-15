---
title: 'Anytrust Orbit Deployment'
sidebar_label: 'Anytrust Orbit Deployment'
description: 'Arbitrum SDK '
author: Mehdi Salehi
sme: Mehdi Salehi
target_audience: 'Developers deploying and maintaining Orbit chains.'
sidebar_position: 2
---

This section explains how to to initiate an <a data-quicklook-from="arbitrum-anytrust-chain">Anytrust Orbit chain</a> using [Arbitrum's Orbit SDK](https://github.com/OffchainLabs/arbitrum-orbit-sdk/blob/main/examples/set-valid-keyset/index.ts).

###### For those who prefer an immediate hands-on coding experience, we recommend starting with the "set-valid-keyset" [example](https://github.com/OffchainLabs/arbitrum-orbit-sdk/blob/main/examples/set-valid-keyset/index.ts) located in the Orbit SDK repository. This example code will walk you through the process of setting a keyset for your anytrust orbit chain.

### About Anytrust Orbit

Anytrust chains represent a different model than Rollup chains, offering unique features and deployment processes. For a comprehensive understanding of the general principles of Orbit chains and the differences between Orbit chain types, please refer to [Orbit SDK introduction](../orbit-sdk-introduction.md) page.

### Deployment Steps 

The deployment process of Anytrust chains is very similar to that of [Rollup chain](deploying-rollup-chain-with-sdk.md#rollup-config-param) but with some differences that we'll go through in this guide.

Here are the steps involved in the deployment process:

1. **Configuring The Deployment Parameters**
2. **Deploying Your Anytrust chain**

4. **Setting Anytrust Keyset**

      In the deployment of an Anytrust Orbit chain, a crucial step involves defining and setting up the <a data-quicklook-from="data-availability-committee-dac">`Data Availability Committee (DAC)`</a> keyset. This keyset, comprising keys from the appointed members of the DAC, is essential for ensuring data availability and integrity. Once you have selected your committee members and gathered their keys, these keys are then configured into a keyset using the Orbit SDK. This keyset is subsequently embedded into the chain, serving as a verification mechanism to maintain the trust and security of the Anytrust chain. The proper configuration and deployment of this keyset are vital for the effective operation and reliability of the Anytrust model within the Arbitrum Orbit framework.

We will explain each step on the coming sections:

### 1. Deployment Configuration Parameters 

Similar to the Rollup chain, you'll need to prepare the chain configuration, focusing on parameters that are specific to Anytrust chains.

Deploying an Anytrust Orbit chain involves a series of steps that mirror those required for a Rollup Orbit chain, with certain specificities unique to the Anytrust model. 

Here’s an overview of the steps involved in configuring and deploying an Anytrust Orbit chain:

1. **Chain Config Parameter**: Start by setting up the chain configuration parameters. This includes defining key elements like:
- `chainId` 
- `DataAvailabilityCommittee`
- `InitialChainOwner`
- `MaxCodeSize`
- `MaxInitCodeSize`

The `chainConfig` parameter within the `Config` structure is an essential element for tailoring your Orbit chain according to specific needs. This parameter is particularly significant when setting up an Anytrust Orbit chain, as it includes configurations that distinguish it from a Rollup chain. The key parameter that differentiates an Anytrust chain in this context is the `DataAvailabilityCommittee`.

For an Anytrust chain, you need to set the `DataAvailabilityCommittee` to **true**. This setting is crucial as it indicates the chain's reliance on a committee for data availability, which is a hallmark of the Anytrust model.

Here’s an example of how to configure the `chainConfig` for an Anytrust chain using the Orbit SDK:

```js
import { prepareChainConfig } from '@arbitrum/orbit-sdk';

const chainConfig = prepareChainConfig({
    chainId: Some_Chain_ID,
    arbitrum: { InitialChainOwner: deployer_address, DataAvailabilityCommittee: true },
});
```

In this example, you set up the chain configuration with a specific `chainId`, the `InitialChainOwner` as the deployer's address, and importantly, you configure the `DataAvailabilityCommittee` as `true`. This configuration ensures that your Orbit chain is set up as an Anytrust chain, utilizing the unique features and operational model of the Anytrust system within the Arbitrum Orbit framework.

These parameters tailor the chain to your specific requirements and operational context.

2. **Configuration of `RollupCreator` Params and Deployment of Anytrust on Orbit SDK**:

    Uses the Orbit SDK's functionalities to configure the `RollupCreator` parameters. 
    This step involves preparing the deployment settings for the Anytrust chain, including the core contracts and operational parameters that govern the chain's functionality.

The process of configuring and deploying an Anytrust Orbit chain closely parallels that of a Rollup Orbit chain, as detailed on the Rollup deployment page. The key lies in utilizing specific APIs provided by the Orbit SDK, which are instrumental in preparing and executing the deployment. These APIs are:

  1. `createRollupPrepareConfig` API: This API is used to set up the configuration for your Anytrust chain. It takes in the parameters defined in the Config structure, applies them, and fills in any remaining details with default values. The output is a fully-formed Config structure that is ready for deployment.

  2. `createRollupPrepareTransactionRequest` API: After configuring your chain with the `createRollupPrepareConfig` API, the next step is to use the `createRollupPrepareTransactionRequest` API. This API is designed to take the parameters defined in the `RollupDeploymentParams`, along with the configuration generated by the `createRollupPrepareConfig` API, to prepare a transaction request. This request is then used to invoke the `createRollup` function of the `RollupCreator` contract, which effectively deploys and initializes the core contracts of your Anytrust Orbit chain.

Both of these APIs are critical in the setup process and were previously discussed with examples provided on the  [Rollup deployment page](deploying-rollup-chain-with-sdk.md#rollup-config-param). 

By following those examples and instructions, you can apply the same methods to set up an Anytrust chain, ensuring a seamless and efficient deployment process using the Orbit SDK.

3. **Getting the Anytrust Orbit Chain Information After Deployment**:

    After deploying the Anytrust chain, it's crucial to retrieve detailed information about the deployment. This includes data about the core contracts, the configuration settings, and other relevant operational details. The Orbit SDK provides tools for extracting this information efficiently.

4. **Setting Valid Keyset on Parent Chain**:

    A unique aspect of the Anytrust model is setting up a valid keyset for the <a data-quicklook-from="arbitrum-rollup-chain">`Data Availability Committee (DAC)`</a> on the parent chain. This step involves defining and deploying a set of cryptographic keys that will be used by the DAC to ensure data availability and integrity.

Each of these steps plays a vital role in the successful deployment and operation of an Anytrust Orbit chain. The upcoming sections will provide detailed explanations and guidance on how to accomplish each step, ensuring a smooth and effective deployment process. By following these guidelines, developers can leverage the capabilities of the Orbit SDK to set up an Anytrust chain that meets their specific needs and aligns with their project goals.


#### 2. Configuration of `RollupCreator` Params and Deployment of Anytrust on Orbit SDK


### 3. Getting the Anytrust Orbit Chain Information After Deployment:

The procedure for retrieving information about your deployed Anytrust Orbit chain is identical to the method used for Rollup Orbit chains, as detailed on the Rollup Orbit page. This consistency in approach ensures a streamlined process, regardless of the type of Orbit chain you are working with.

To extract detailed information about your Anytrust Orbit chain post-deployment, you will use the same API and steps as you would for a Rollup Orbit chain. Here's a reminder of the example:

```js
import { createRollupPrepareTransactionReceipt } from '@arbitrum/orbit-sdk';

const data = createRollupPrepareTransactionReceipt(txReceipt);
```

In this example, `txReceipt` refers to the transaction receipt you received after deploying the Anytrust chain. By inputting this receipt into the `createRollupPrepareTransactionReceipt` function, you can access comprehensive data about your deployment, including details about the core contracts and configuration settings.


### 4. Setting Valid Keyset on Parent Chain:

The final step in deploying your Anytrust Orbit chain is to set up the valid keyset for your Data Availability Committee (DAC) on the parent chain. This keyset is essential for ensuring that the parent chain can verify the data from your Orbit chain. The process of generating keys and the keyset for your committee is comprehensively explained in our documentation (referenced as '#'). Once you have your keyset, it needs to be established on the `SequencerInbox` contract of your Orbit chain on the parent chain.

To facilitate this, we provide an API in Orbit SDK named `setValidKeysetPrepareTransactionRequest`. This API aids in setting the keyset on the parent chain. To use this API, you need specific information that you gathered in step 3. This includes the `upgradeExecutor` and `sequencerInbox` addresses of your Orbit chain, the generated keyset for your committee, and the account of the owner.

Here's an example of how you can use the Orbit SDK to set the keyset:

```js
const txRequest = await setValidKeysetPrepareTransactionRequest({
  coreContracts: {
    upgradeExecutor: 'upgradeExecutor_address',
    sequencerInbox: 'sequencerInbox_address',
  },
  keyset,
  account: deployer.address,
  publicClient: parentChainPublicClient,
});
```

In this example, `upgradeExecutor_address` and `sequencerInbox_address` are placeholders for the actual addresses of the respective contracts in your Orbit chain. `keyset` is the keyset you generated for your committee, and `deployer.address` refers to the owner's account address.

After you create the transaction request using the above API, the next step is to sign and send the transaction. This action will effectively set the keyset on the parent chain, allowing it to recognize and verify the valid keyset for your Anytrust Orbit chain. This step is crucial for the operational integrity and security of your Anytrust chain, ensuring that the data verified by the DAC is recognized and accepted by the parent chain.