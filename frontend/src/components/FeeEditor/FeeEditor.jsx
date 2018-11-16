import React, {PureComponent} from 'react';
import AddFeeForm from './FeeAddNewForm/FeeAddNewForm';
import FeeList from "./FeeList/FeeList";
import getHttpClient from "../../httpclient/HttpClient";
import {Link} from "react-router-dom";
import './FeeEditor.css';

export class FeeEditor extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      createdFee: [],
      feeList: []
    };
    this.addFee = this.addFee.bind(this);
    this.removeFee = this.removeFee.bind(this);
  }

  async componentDidMount() {
    try {
      await this.getAllFees();
    } catch (error) {
      console.log(error);
    }
  }

  async getAllFees() {
    try {
      const response = await getHttpClient().getAll();
      this.setState(() => {
        return {
          feeList: response.result
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async addFee(from, to, fee) {
    try {
      const response = await getHttpClient().add(from, to, fee);
      const data = response.result;
      this.setState((prevState) => {
        return {
          feeList: [...prevState.feeList, data],
          createdFee: data
        }
      });
    } catch (error) {
      console.log(error);
    }
  }

  async removeFee(id) {
    await getHttpClient().remove(id)
    .then(() => this.setState((prevState) => {
      const {feeList} = prevState;
      const index = feeList
      .indexOf(feeList.find(fee => fee.id === id));
      return {
        feeList: [
          ...prevState.feeList.slice(0, index),
          ...prevState.feeList.slice(index + 1)
        ]
      }
    }));
  }

  render() {
    const {feeList, from, to} = this.state;
    return (
        <div className="bilderlings-homework-fee-editor">
          <Link to="/currency-calc"> Go to currency calculator </Link>
          <AddFeeForm
              addFee={this.addFee}
              fromInitialValue={from}
              toInitialValue={to}
          />
          <FeeList
              feeList={feeList}
              from={from}
              to={to}
              removeFee={this.removeFee}
          />
        </div>
    )
  }
}

