import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner';
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';
import axios from '../../axios-orders';
import * as actions from '../../store/actions';

export const burgerBuilder = (props) => {
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    props.onInitIngredients();
  }, []);

  const updatePurchaseState = (ingredients) => {
    const sum = Object.keys(ingredients)
      .map(igKey => {
        return ingredients[igKey];
      })
      .reduce((sum, el) => {
        return sum + el;
      }, 0);
    return sum > 0;
  }

  const purchaseHandler = () => {
    if (props.isAuthenticated) {
      setPurchasing(true);
    } else {
      props.onSetAuthRedirectPath('/checkout');
      props.history.push('/auth');
    }
  }

  const purchaseCancelHandler = () => {
    setPurchasing(false);
  }

  const purchaseContinueHandler = () => {
    props.onInitPurchase();
    props.history.push('/checkout');
  }

  const disabledInfo = {
    ...props.ings,
  };
  for (let key in disabledInfo) {
    disabledInfo[key] = disabledInfo[key] <= 0;
  }

  let orderSummary = null;
  let burger = props.error ? <p>Ingredient's can't be loaded</p> : <Spinner />;

  if (props.ings) {
    burger = (
      <>
      <Burger ingredients={props.ings} />
      <BuildControls
        ingredientAdded={props.onIngredientAdded}
        ingredientRemoved={props.onIngredientRemoved}
        disabled={disabledInfo}
        price={props.price}
        purchasable={updatePurchaseState(props.ings)}
        ordered={purchaseHandler}
        isAuth={props.isAuthenticated}
      />
      </>
    );

    orderSummary = (
      <OrderSummary
        ingredients={props.ings}
        price={props.price}
        purchaseCancelled={purchaseCancelHandler}
        purchaseContinued={purchaseContinueHandler}
      />
    );
  }

  return (
    <>
      <Modal show={purchasing} modalClosed={purchaseCancelHandler}>
        {orderSummary}
      </Modal>
      {burger}
    </>
  );
}

const mapStateToProps = state => ({
  ings: state.burgerBuilder.ingredients,
  price: state.burgerBuilder.totalPrice,
  error: state.burgerBuilder.error,
  isAuthenticated: state.auth.token !== null,
});

const mapDispatchToProps = dispatch => ({
  onIngredientAdded(name) {
    dispatch(actions.addIngredient(name));
  },

  onIngredientRemoved(name) {
    dispatch(actions.removeIngredient(name));
  },

  onInitIngredients() {
    dispatch(actions.initIngredients());
  },

  onInitPurchase() {
    dispatch(actions.purchaseInit());
  },

  onSetAuthRedirectPath(path) {
    dispatch(actions.setAuthRedirectPath(path));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withErrorHandler(burgerBuilder, axios));
