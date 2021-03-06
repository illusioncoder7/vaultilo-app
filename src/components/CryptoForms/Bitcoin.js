import React, { useEffect, useState, useRef } from 'react';
import { Modal, Overlay, Tooltip } from 'react-bootstrap';
import * as bip39 from 'bip39';
import WAValidator from 'wallet-address-validator';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { invalid } from 'moment';

export default function Bitcoin(props) {
  const {
    credentials,
    setCredentials,
    subType,
    onModalClose,
    selectedItem,
    setModalTransparent,
  } = props;
  const credentialsString = JSON.stringify(credentials);
  const defaultValue = selectedItem
    ? {
        walletName: selectedItem.walletName,
        walletAddress: selectedItem.walletAddress,
        seedWords: selectedItem.seedWords,
        privateKey: selectedItem.privateKey,
      }
    : {
        walletName: '',
        walletAddress: '',
        seedWords: '',
        privateKey: '',
      };

  const [walletName, setWalletName] = useState(defaultValue.walletName);
  const [walletAddress, setWalletAddress] = useState(defaultValue.walletAddress);
  const [seedWords, setSeedWords] = useState(defaultValue.seedWords);
  const [privateKey, setPrivateKey] = useState(defaultValue.privateKey);
  const [clicked, setClicked] = useState(false);
  const [emptyWalletName, setEmptyWalletName] = useState(null);
  const [confirmationModalShow, setConfirmationModalShow] = useState(false);
  const [invalidFields, setInvalidFields] = useState([]);
  const [pwTooltip, setPwTooltip] = useState(false);
  const [walletAddTooltip, setWalletAddTooltip] = useState(false);
  const [privateKeyTooltip, setPrivateKeyTooltip] = useState(false);

  const passwordRef = useRef(null);
  const walletAddRef = useRef(null);
  const privateKeyRef = useRef(null);
  const handleTooltipClick = type => {
    if (type === 'password') {
      setPwTooltip(true);
    }

    if (type === 'walletAdd') {
      setWalletAddTooltip(true);
    }
    if (type === 'private') {
      setPrivateKeyTooltip(true);
    }
    setTimeout(() => {
      setPwTooltip(false);
      setPrivateKeyTooltip(false);
      setWalletAddTooltip(false);
    }, 1000);
  };

  useEffect(() => {
    if (clicked) {
      setClicked(false);
      onModalClose();
    }
  }, [credentialsString]);

  const getInvalidFields = () => {
    const invalidFields = [];
    if (!WAValidator.validate(walletAddress, 'BTC') && walletAddress.length) {
      invalidFields.push('Wallet Address is not valid');
    }
    if (walletAddress.length && !privateKey.length) {
      invalidFields.push('Private key is empty ');
    }
    if (!bip39.validateMnemonic(seedWords) && seedWords.length) {
      invalidFields.push('Seed words not valid');
    }
    if (privateKey.length && !walletAddress.length) {
      invalidFields.push('Address is empty ');
    }
    if (!walletAddress.length && !privateKey.length && !seedWords.length) {
      invalidFields.push('All fields are empty');
    }
    return invalidFields;
  };

  const handleUpdate = () => {
    if (!walletName.length) {
      setEmptyWalletName(true);
    } else if (getInvalidFields().length) {
      setInvalidFields(getInvalidFields());
      setConfirmationModalShow(true);
      setModalTransparent(true);
    } else {
      submitUpdateForm();
    }
  };

  const submitCreateForm = () => {
    const newCred = {
      id: Date.now(),
      type: 'crypto',
      subType: subType,
      walletName,
      walletAddress,
      seedWords,
      privateKey,
      timeStamp: Date.now(),
    };
    setClicked(true);
    setCredentials(JSON.stringify([...credentials, newCred]));
  };

  const submitUpdateForm = () => {
    const updatedCredentials = credentials.map(item => {
      if (item.id === selectedItem.id) {
        return {
          ...item,
          walletName,
          walletAddress,
          seedWords,
          privateKey,
          timeStamp: Date.now(),
        };
      }
      return item;
    });
    setClicked(true);
    setCredentials(JSON.stringify(updatedCredentials));
  };

  const handleSubmit = () => {
    if (!walletName.length) {
      setEmptyWalletName(true);
    } else if (getInvalidFields().length) {
      setInvalidFields(getInvalidFields());
      setConfirmationModalShow(true);
      setModalTransparent(true);
    } else {
      submitCreateForm();
    }
  };

  const handleBackClick = () => {
    setConfirmationModalShow(false);
    setModalTransparent(false);
  };

  const handleConfirmClick = () => {
    if (selectedItem) {
      submitUpdateForm();
    } else {
      submitCreateForm();
    }
  };

  return (
    <>
      <div className="form-group row">
        <label htmlFor="inputName" className="col-12 custom-label">
          Bitcoin Wallet Name
        </label>
        <div className="col-12">
          <input
            type="text"
            className={`custom-input form-control ${emptyWalletName ? 'invalid' : ''}`}
            id="inputName"
            value={walletName}
            onChange={evt => setWalletName(evt.target.value)}
          />
          {emptyWalletName ? <span className="validation-text">Required</span> : null}
        </div>
      </div>
      <div className="field-wrapper">
        <div className="form-group row">
          <label htmlFor="inputSeedWords" className="col-12 custom-label">
            Seed Words
          </label>
          <div className="col-12">
            <input
              type="text"
              className="custom-input form-control"
              id="inputSeedWords"
              value={seedWords}
              onChange={evt => setSeedWords(evt.target.value)}
            />
            <CopyToClipboard text={seedWords}>
              <span
                ref={passwordRef}
                className="copy-btn copy-btn-input"
                data-clipboard-target="#inputPassword"
                onClick={() => handleTooltipClick('password')}
              >
                <img src="/images/copy.png" alt="copy" />
              </span>
            </CopyToClipboard>
            <Overlay target={passwordRef.current} show={pwTooltip} placement="top">
              {props => (
                <Tooltip id="overlay-example" {...props}>
                  Copied
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
        <div className="separator">
          <div className="separator-line" />
          <div>Or</div>
          <div className="separator-line" />
        </div>
        <div className="form-group row">
          <label htmlFor="inputAddress" className="col-12 custom-label">
            Wallet Address
          </label>
          <div className="col-12">
            <input
              type="text"
              className="custom-input form-control"
              id="inputAddress"
              value={walletAddress}
              onChange={evt => setWalletAddress(evt.target.value)}
            />
            <CopyToClipboard text={walletAddress}>
              <span
                ref={walletAddRef}
                className="copy-btn copy-btn-input"
                data-clipboard-target="#inputAddress"
                onClick={() => handleTooltipClick('walletAdd')}
              >
                <img src="/images/copy.png" alt="copy" />
              </span>
            </CopyToClipboard>
            <Overlay target={walletAddRef.current} show={walletAddTooltip} placement="top">
              {props => (
                <Tooltip id="overlay-example" {...props}>
                  Copied
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="inputPrivate" className="col-12 custom-label">
            Private Key
          </label>
          <div className="col-12">
            <input
              type="text"
              className="custom-input form-control"
              id="inputPrivate"
              value={privateKey}
              onChange={evt => setPrivateKey(evt.target.value)}
            />
            <CopyToClipboard text={privateKey}>
              <span
                ref={privateKeyRef}
                className="copy-btn copy-btn-input"
                data-clipboard-target="#inputAddress"
                onClick={() => handleTooltipClick('private')}
              >
                <img src="/images/copy.png" alt="copy" />
              </span>
            </CopyToClipboard>
            <Overlay target={privateKeyRef.current} show={privateKeyTooltip} placement="top">
              {props => (
                <Tooltip id="overlay-example" {...props}>
                  Copied
                </Tooltip>
              )}
            </Overlay>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-end">
        {selectedItem ? (
          <button
            disabled={clicked}
            type="button"
            className="btn btn-primary mr-2"
            onClick={handleUpdate}
          >
            Update
          </button>
        ) : (
          <button
            disabled={clicked}
            type="button"
            className="btn btn-primary mr-2"
            onClick={handleSubmit}
          >
            Save
          </button>
        )}
        <button type="button" className="btn btn-danger" onClick={onModalClose}>
          Cancel
        </button>
      </div>
      <Modal
        dialogClassName="custom-modal"
        show={confirmationModalShow}
        onHide={handleBackClick}
        aria-labelledby="contained-modal-title-vcenter"
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <div>Do you still want to continue ?</div>
            <div className="modal-info">{`${invalidFields.join(', ')}.`}</div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="confirmation-body d-flex justify-content-end">
            <button className="btn btn-danger mr-2" onClick={handleConfirmClick} disabled={clicked}>
              Confirm
            </button>
            <button className="btn btn-primary" onClick={handleBackClick}>
              Back
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
