
//nepřepsáno



import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { createPost } from '../actions'

class PostsNew extends Component {

  renderField(field) {
    const { meta: { touched, error} } = field;
    const className = `form-group ${touched && error ? 'has-danger' : ''}`

    return (
      <div className={className}>
        <label>{field.label}</label>
        <input
          className="form-control"
          type="text"
          {...field.input}
        />
        <div className="text-help">
        {touched ? error : ''}
        </div>
      </div>
    );
  }
  // {field.meta.touch ? field.meta.error : ''}
  // /*pouze když odejdu z políčka, hledej chybu - jinak ukaž prázdný string */

  onSubmit(values) {
    // this.props.history.push('/'); ... ale zavolat až se odešle úspěšně formulář!!
    //jinak se může stát 50 x 50, že se vrátím, ale ještě nebude POST udělaný. Tak musím pak udělat refresh stránky.
    // //musíme použít vždy ActionCreator
    // this.props.createPost(values);

    this.props.createPost(values, () => {
      this.props.history.push('/');     //callback - až když je to POST realizován
    });
  }


  render() {
    const { handleSubmit } = this.props;

    return (
      <form onSubmit={handleSubmit(this.onSubmit.bind(this))} >
        <Field
          label="Titulek článku"
          name="title"
          component={this.renderField}
        />
        <Field
          label="Kategorie"
          name="categories"
          component={this.renderField}
        />
        <Field
          label="Článek"
          name="content"
          component={this.renderField}
        />
      <button type="submit" className="btn btn-primary">Odeslat</button>
      <Link to="/" className="btn btn-danger">Zrušit</Link>
      </form>
    )
  }
}

function validate(values) {
  const errors = {};

  if (!values.title || values.title.length < 3) {
    errors.title = "Víš, že titulek musí mít alespoň 3 znaky?";
  }

  if (!values.title) {
    errors.title = "Už zase není titulek";
  }

  if (!values.categories) {
    errors.categories = "Čeče, napiš kategorii";
  }

  if (!values.content) {
    errors.content = "Ups - napiš libovolný obsah. jo?";
  }

  return errors;
}

export default reduxForm({
  validate,
  form: 'PostsNewForm'
})(
  connect(null,{ createPost })(PostsNew)
);
