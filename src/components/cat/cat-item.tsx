import React, { useState, useCallback } from "react";
import { ethers } from "ethers";
import { Cat, CatInfo } from "../../contexts/graph/types";
import { WRAPPER, hexToAscii, calculatePrice, drawCat } from "../../utils";
import Modal from "../ui/modal";
import moment from "moment";

const CatItem: React.FC<{
  hasRescuerIdx?: boolean;
  rescuerId?: number;
  cat: Cat;
  catInfo?: CatInfo;
  onClick(cat: Cat): void;
  children: React.ReactChild;
}> = ({
  cat,
  onClick,
  hasRescuerIdx: hasRescueIdx = false,
  catInfo,
  children,
}) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [isHistoryModalOpen, setHistoryModalOpen] = useState<boolean>(false);
  const {
    id,
    name,
    activeAdoptionOffer,
    activeAdoptionRequest,
    requestPrices,
    offerPrices,
  } = cat;
  const img = drawCat(id, 10);

  const handleModalOpen = useCallback(() => setModalOpen(true), []);
  const handleModalClose = useCallback(() => setModalOpen(false), []);

  const handleHistoryModalOpen = useCallback(
    () => setHistoryModalOpen(true),
    []
  );
  const handleHistoryModalClose = useCallback(
    () => setHistoryModalOpen(false),
    []
  );
  const hasHistory = requestPrices.length !== 0 || offerPrices.length !== 0;

  const onClickHandler = useCallback(() => {
    onClick(cat);
  }, [cat, onClick]);

  return (
    <>
      <div className="nft" key={id} data-item-id={id}>
        <div className="nft__adoption" onClick={handleModalOpen}>
          {/* TODO: note nft__adoption_offered class on wrapper */}
          {activeAdoptionOffer?.toAddress.toLowerCase() == WRAPPER && (
            <div className="nft__adoption_offered">W</div>
          )}
          {/* {wasWrapped && <div className="nft__was_wrapped">W</div>} */}
          {activeAdoptionOffer?.toAddress.toLowerCase() != WRAPPER &&
            activeAdoptionOffer && (
              <div className="nft__adoption_offered">O</div>
            )}
          {activeAdoptionRequest && (
            <div className="nft__adoption_requested">R</div>
          )}
        </div>
        {hasHistory && (
          <div className="nft__history" onClick={handleHistoryModalOpen}>
            H
          </div>
        )}
        <div className="nft__image">
          {img ? (
            <img loading="lazy" src={img} />
          ) : (
            <div className="no-img">NO CAT</div>
          )}
        </div>
        <div
          className="nft__meta"
          onClick={onClickHandler}
          title="Click to Copy Cat ID"
        >
          <div className="nft__meta_row">
            <div className="nft__meta_title">Cat id</div>
            <div className="nft__meta_dot"></div>
            <div className="nft__meta_value">{id}</div>
          </div>
          {name && (
            <div className="nft__meta_row">
              <div className="nft__meta_title">Name</div>
              <div className="nft__meta_dot"></div>
              <div className="nft__meta_value">{hexToAscii(name)}</div>
            </div>
          )}
          <div className="nft__meta_row">
            <div className="nft__meta_title">Rescued on</div>
            <div className="nft__meta_dot"></div>
            <div className="nft__meta_value">
              {moment(Number(cat.rescueTimestamp) * 1000).format(
                "MM/D/YY hh:mm"
              )}
            </div>
          </div>
          {catInfo && (
            <>
              <div className="nft__meta_row">
                <div className="nft__meta_title">Color</div>
                <div className="nft__meta_dot"></div>
                <div className="nft__meta_value">{catInfo.color}</div>
              </div>
              <div className="nft__meta_row">
                <div className="nft__meta_title">Palette</div>
                <div className="nft__meta_dot"></div>
                <div className="nft__meta_value">{catInfo.palette}</div>
              </div>
              <div className="nft__meta_row">
                <div className="nft__meta_title">Pattern</div>
                <div className="nft__meta_dot"></div>
                <div className="nft__meta_value">{catInfo.pattern}</div>
              </div>
              <div className="nft__meta_row">
                <div className="nft__meta_title">Statistical Rank</div>
                <div className="nft__meta_dot"></div>
                <div className="nft__meta_value">{catInfo.statisticalRank}</div>
              </div>
              <div className="nft__meta_row">
                <div className="nft__meta_title">Trait Rarity Rank</div>
                <div className="nft__meta_dot"></div>
                <div className="nft__meta_value">{catInfo.traitRarityRank}</div>
              </div>
            </>
          )}
        </div>
        {children}
      </div>
      <Modal open={isHistoryModalOpen} handleClose={handleHistoryModalClose}>
        <div className="adoption">
          {offerPrices.length !== 0 && (
            <div className="adoption__item">
              <h3>Historical Offer Prices</h3>
              <ul className="adoption__item_table">
                {/* @ts-ignore */}
                {offerPrices
                  .sort(
                    (a, b) =>
                      //@ts-ignore
                      new Date(Number(a.timestamp) * 100) -
                      //@ts-ignore
                      new Date(Number(b.timestamp) * 100)
                  )
                  .map((item) => (
                    <li className="table-row" key={item.timestamp}>
                      <span className="table-row-column">
                        {moment(Number(item.timestamp) * 1000).format(
                          "MMMM D YYYY h:mm"
                        )}
                      </span>
                      <span className="table-row-column">
                        {calculatePrice(item.price)}&nbsp;ETH
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
          {requestPrices.length !== 0 && (
            <div className="adoption__item">
              <h3>Historical Request Prices</h3>
              <ul className="adoption__item_table">
                {/* @ts-ignore */}
                {requestPrices
                  .sort(
                    (a, b) =>
                      //@ts-ignore
                      new Date(Number(a.timestamp) * 100) -
                      //@ts-ignore
                      new Date(Number(b.timestamp) * 100)
                  )
                  .map((item) => (
                    <li className="table-row" key={item.timestamp}>
                      <span className="table-row-column">
                        {moment(Number(item.timestamp) * 1000).format(
                          "MMMM D YYYY h:mm"
                        )}
                      </span>
                      <span className="table-row-column">
                        {calculatePrice(item.price)}&nbsp;ETH
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </Modal>
      <Modal open={isModalOpen} handleClose={handleModalClose}>
        <div
          className={`adoption ${activeAdoptionOffer && "offer"} ${
            activeAdoptionRequest && "request"
          }`}
        >
          {activeAdoptionOffer?.toAddress.toLowerCase() == WRAPPER && (
            <div className="adoption__item">
              <h3>Wrapped</h3>
              <p>Too bad...</p>
            </div>
          )}
          {activeAdoptionOffer?.toAddress.toLowerCase() != WRAPPER &&
            activeAdoptionOffer && (
              <div className="adoption__item">
                <h3>Offer</h3>
                <p>
                  Owner of this cat is offering &nbsp;
                  {activeAdoptionOffer.toAddress !=
                  ethers.constants.AddressZero ? (
                    <a
                      target="blank"
                      rel="noreferrer"
                      href={`https://etherscan.io/address/${activeAdoptionOffer.toAddress}`}
                    >
                      {activeAdoptionOffer.toAddress}
                    </a>
                  ) : (
                    "everyone"
                  )}
                  , to buy it from them for{" "}
                  {calculatePrice(activeAdoptionOffer.price)} ETH
                </p>
              </div>
            )}
          {activeAdoptionRequest && (
            <div className="adoption__item">
              <h3>Request</h3>
              <p>
                <a
                  target="blank"
                  rel="noreferrer"
                  href={`https://etherscan.io/address/${activeAdoptionRequest.from}`}
                >
                  {activeAdoptionRequest.from}
                </a>{" "}
                likes this cat, and they want to buy it for&nbsp;
                {calculatePrice(activeAdoptionRequest.price)} ETH
                {activeAdoptionOffer?.toAddress.toLowerCase() == WRAPPER &&
                  "... shame it is wrapped :("}
              </p>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

export default React.memo(CatItem);