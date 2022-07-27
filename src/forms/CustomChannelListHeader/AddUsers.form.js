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
        const disableOtherUsers = ({currentEmail, currentOffice}) => {
          if(values?.selectedUsers){
            const idx = values?.selectedUsers?.findIndex(u => u.email === currentEmail);
            if(idx > -1){
              const thatUser = values?.selectedUsers[idx];
              if(thatUser.office !== currentOffice)
                return true;
            }
          }
          return false;
        }
        return (
          <form onSubmit={handleSubmit} className="add-users-form">
            <FieldArray name="selectedUsers">
              {({ fields }) => (
                <div>
                  <ul>
                    {similarUsers.map((user, idx) => {
                      const { name, office, email, imageUrl } = user;
                      if (disableOtherUsers({ currentEmail: email, currentOffice: office })) {
                        return null
                      }
                      return (
                        <li key={idx}>
                          <section className='checkbox-section'>
                            <Field
                              id={idx}
                              name={fields.name}
                              component="input"
                              type="checkbox"
                              value={user}
                            />
                          </section>
                          <label htmlFor={idx}>

                          <section className='info-section'>
                            <div className="form-image-container">
                              <div className='image'>
                                <img src={imageUrl} alt="profile-pic" />
                              </div>
                            </div>
                            <div className='form-info-container'>
                              <p className='chat-header-form-name'>{name}</p>
                              <p className='chat-header-form-email'>{office || 'Account Owner'}</p>
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
