import { Form as FinalForm, Field } from 'react-final-form';
import React from 'react';
import arrayMutators from 'final-form-arrays';
import { FieldArray } from 'react-final-form-arrays';


export default function AddUsers(props) {
  return (
    <FinalForm
      {...props}
      mutators={{ ...arrayMutators }}
      render={(formRenderProps) => {
        const { handleSubmit, values, valid, similarUsers } = formRenderProps;
        //console.log(values);
        return (
          <form onSubmit={handleSubmit} className="add-users-form">
            <FieldArray name="selectedUsers">
              {({ fields }) => (
                <div>
                  <ul>
                    {similarUsers.map(user => {
                      const { name, email, imageUrl } = user
                      return (
                        <li key={email}>
                          <section className='checkbox-section'>
                            <Field
                              id={email}
                              name={fields.name}
                              component="input"
                              type="checkbox"
                              value={email}
                            />
                          </section>
                          <label htmlFor={email}>

                          <section className='info-section'>
                            <div className="form-image-container">
                              <div className='image'>
                                <img src={imageUrl} alt="profile-pic" />
                              </div>
                            </div>
                            <div className='form-info-container'>
                              <p className='chat-header-form-name'>{name}</p>
                              <p className='chat-header-form-email'>{email}</p>
                            </div>
                          </section>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}
            </FieldArray>
            <div className='chat-header-form-submit-section'>
              <button type='submit'>Submit</button>
            </div>
          </form>
        );
      }}
    />
  );
}
