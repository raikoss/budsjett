import React from "react";

const Transaction = ({transaction}) => {
    return (
        <div className={"transaction row valign-wrapper " + (transaction.adding ? "positive" : "negative")}>
            <div className="col s2">
                {transaction.category}
            </div>
            <div className="col s6">
                {transaction.comment}
            </div>
            <div className="col s4">
                {transaction.amount}
            </div>
        </div>
    )
}

export default Transaction;