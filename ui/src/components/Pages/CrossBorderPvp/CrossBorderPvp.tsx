//
// Copyright (c) 2021, Digital Asset (Switzerland) GmbH and/or its affiliates. All rights reserved.
// SPDX-License-Identifier: Apache-2.0
//

import React, { useState } from "react";
import { computeCredentials } from "../../../Credentials";
import { Central, Commercial } from "../../../models/Banks";
import Bank from "../../Organisms/Bank/Bank";
import styles from "./CrossBorderPvp.module.css";
import Modal from "../../Atoms/Modal";
import { RightBunchOfLogos } from "../../Atoms/RightBunchOfLogos/RightBunchOfLogos";
import { LeftBunchOfLogos } from "../../Atoms/LeftBunchOfLogos/LeftBunchOfLogos";
import CentralBankFirstFlow from "../../Organisms/CentralBankFirstFlow/CentralBankFirstFlow";
import { InfoComponent } from "../../Atoms/InfoComponent/InfoComponent";
import FirstPoint from "../../../static/assets/NewIcons/Step_1_Icon.svg";
import SecondPoint from "../../../static/assets/NewIcons/Step_2_Icon.svg";
import ThirdPoint from "../../../static/assets/NewIcons/Step_3_Icon.svg";
import FourthPoint from "../../../static/assets/NewIcons/Step_4_Icon.svg";
import Atomic from "../../../static/assets/Icons/Atomic_Icon.svg";
import Privacy from "../../../static/assets/Icons/Privacy_Icon.svg";
import Button from "../../Atoms/Button";
import { PvpProcessVisualization } from "./PvpProcessVisualization";
import { Credentials } from "../../../models/CredentialsType";
import { DamlLedgerWithPartyId } from "../../../DamlFunctions/DamlLedgerWithPartyId";

const parties = [
  Central.CentralBank1,
  Central.CentralBank2,
  Commercial.BankA,
  Commercial.BankB,
];
const credentials: Credentials[] = parties.map((el: string) =>
  computeCredentials(el)
);
const [credentialUSA, credentialEU, credentialBankA, credentialBankB] =
  credentials;

const CrossBorderPvp: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleShowModal = () => setShowModal(true);

  const handleChangeShowModal = (isShow: boolean) => () => setShowModal(isShow);

  const [isShownHints, setIsShownHints] = useState<boolean>(false);
  const handleToggleHints = () => setIsShownHints(!isShownHints);

  return (
    <div className={styles.main}>
      <DamlLedgerWithPartyId {...credentialBankA}>
        <PvpProcessVisualization
          bankA={credentialBankA.partyId}
          bankB={credentialBankB.partyId}
        />
      </DamlLedgerWithPartyId>
      <div className={`${styles.leftLogosWrapper}`}>
        <LeftBunchOfLogos />
      </div>
      <div className={`${styles.rightLogosWrapper}`}>
        <RightBunchOfLogos />
      </div>
      <h1 className={`${styles.mainTitle}`}>TRUE INTEROPERABILITY </h1>
      <InfoComponent
        additionalInfo={AdditionalHints(handleShowModal)}
        listOfHints={infoList}
        toggle={handleToggleHints}
        isShown={isShownHints}
        title={"WHAT CAN I DO IN THIS SECTION?"}
        subtitle={"Section Steps:"}
      />
      <DamlLedgerWithPartyId {...credentialUSA}>
        <CentralBankFirstFlow displayName={Central.CentralBank1} />
      </DamlLedgerWithPartyId>

      <DamlLedgerWithPartyId {...credentialEU}>
        <CentralBankFirstFlow displayName={Central.CentralBank2} />
      </DamlLedgerWithPartyId>

      <DamlLedgerWithPartyId {...credentialBankA}>
        <Bank displayName={Commercial.BankA} counterparty={Commercial.BankB} />
      </DamlLedgerWithPartyId>

      <DamlLedgerWithPartyId {...credentialBankB}>
        <Bank displayName={Commercial.BankB} counterparty={Commercial.BankA} />
      </DamlLedgerWithPartyId>

      <Modal show={showModal} handleClose={handleChangeShowModal(false)} />
    </div>
  );
};

export default CrossBorderPvp;

const infoList = [
  {
    img: FirstPoint,
    text: "Use the controls for both Central Banks to transfer money to both Commercial Banks. As a result, the balances for each Bank will increase.",
  },
  {
    img: SecondPoint,
    text: "Use the Controls for Commercial Bank A to propose a PVP to Commercial Bank B, entering the amounts of money and currency to buy and sell.",
  },
  {
    img: "",
    text: "A new PVP Proposal will appear, with the status “Awaiting Response.",
  },
  {
    img: ThirdPoint,
    text: "Use the Controls for Commercial Bank B to Accept or Decline the PVP Proposal. If you Accept, you will then be invited to Allocate funds to the PVP. If you decline, you will need to adjust the terms of the PVP proposal on behalf of Commercial Bank A.",
  },
  {
    img: FourthPoint,
    text: "Once the PVP has been accepted, use the Allocate buttons to Allocate funds on behalf of both Banks. ",
  },
  {
    img: Atomic,
    text: "If both Banks have sufficient funds, the transfers will be completed simultaneously, or “Atomically.” The status of the PVP will change to “Settled.”",
  },
  {
    img: Privacy,
    text: "If either or both Banks have insufficient funds, both legs of the PVP will fail atomically. The status of the PVP will change to “Failed: Insufficient Funds” or simply to “Failed.”",
  },
  {
    img: "",
    text: "For privacy reasons, the system will not reveal the fund insufficiency to all parties - only to the party / parties whose leg(s) caused the failure.",
  },
];
const AdditionalHints = (handleShowModal: () => void) => (
  <div className={styles.additionalHintsContainer}>
    <p className={styles.textHints}>
      In this system, neither leg of the transfer was allowed to occur before
      both legs were verified. In other words, the transaction was “Atomic.”
      This prevents either party from receiving funds without a reciprocal
      transfer being made at the same time.
    </p>
    <p className={styles.textHints}>
      In today’s systems, this is not the case: to see how today’s problematic
      systems work, click below:
    </p>
    <Button
      label={"Today’s Systems"}
      onClick={handleShowModal}
      buttonStyle={styles.hintButton}
    />
  </div>
);
