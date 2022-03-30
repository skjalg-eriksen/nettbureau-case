import React, {useRef} from 'react';
import './css/normalize.css';
import './css/main.css';
import './css/style.css';

function Inputs() {
  let areacode_valid = false; //  keeps track of validity of areacode
  let email_valid = false;    //  keeps trakc of validity of email
  
  const areacode_ref = useRef<HTMLInputElement>(null);  //reference to areacode input
  const area_ref = useRef<HTMLSpanElement>(null);       //reference to area name span
  const phone_ref = useRef<HTMLInputElement>(null);     //reference to phone input
  const email_ref = useRef<HTMLInputElement>(null);     //reference to email input
  const name_ref = useRef<HTMLInputElement>(null);      //reference to email input

  const error_name_ref = useRef<HTMLSpanElement>(null); //reference to name error message
  const error_email_ref = useRef<HTMLSpanElement>(null);//reference to email error message
  const error_phone_ref = useRef<HTMLSpanElement>(null);//reference to phone error message
  const error_area_ref = useRef<HTMLSpanElement>(null); //reference to area error message

  const number_regex = /\D/g;           // regex to replace everything but numbers
  const letter_regex = /[^A-Za-z\s]/g;  // regex to replace everything but letters

  /**
   *  handles onInput on the areacode inputfield
   *  makes a fetch request to the server to see if 
   * 
   *  @var  areacode_valid  keeps track of validity of areacode
   */
  function handle_areacode_input(){
    
    // remove everything but numbers with .replace()
    areacode_ref.current!.value =areacode_ref.current!.value.replace(number_regex,''); 

    // clear area name
    area_ref.current!.innerText = "";
    areacode_valid = false;

    // check with server if areacode is valid and get areaname
    if(areacode_ref.current!.value.length === 4 ){
      fetch('/api/areacode/'+areacode_ref.current!.value)
      .then(res => {
        if(res.ok){
          return res.json();
        }
        throw res
      })
      .then(data => {
        area_ref.current!.innerText = data.area;
        if (data.is_valid){
          areacode_valid = true;
/* 
          // remove error message
          areacode_ref.current!.classList.remove('error');
          error_area_ref.current!.classList.remove('error_status'); */
        }/* else{
          // add error message
          areacode_ref.current!.classList.add('error');
          error_area_ref.current!.classList.add('error_status');
        } */
      });
    }/* else{

      // remove error message
      areacode_ref.current!.classList.remove('error');
      error_area_ref.current!.classList.remove('error_status');
    } */
  }

  /**
   *  handles onInput on email inputfield.
   *  makes a fetch request to the server and ask if the email is valid
   *  if the email is not valid @var email_valid will be false
   *  if the email is valid it will be true
   * 
   *  @var email_valid keeps track of validity of email inputed
   */
  function handle_email_input(){
    email_valid = false;
    // check with server if email is valid and get areaname
    fetch('/api/email/'+email_ref.current!.value)
    .then(res => {
      if(res.ok){
        return res.json();
      }
      throw res
    })
    .then(data => {
      if (data.valid){
        email_valid = true;
      }
    });
  }

  /**
   * handles OnInput on the phone inputfield, removes input that is not numbers
   */
  function handle_phone_input(){
        // remove everything but numbers with .replace()
        phone_ref.current!.value = phone_ref.current!.value.replace(number_regex,''); 
  }

  /**
   *  handles OnInput in the name inputfield
   *  removes input that is not letters
   *  capitalizes the first letter in the names/words entered.
   */
  function handle_name_input(){
    // remove everything but letters
    name_ref.current!.value = name_ref.current!.value.replace(letter_regex,'');

    // get words from 
    let words: Array<String> = name_ref.current!.value.split(' ')

    // loop through words array
    words.map( (word, i)=> {
      if (word){
        words[i] = word[0].toUpperCase() + word.substring(1);
      }
    });
    
    // update the inputfield value
    name_ref.current!.value = words.join(' ');
  }

  /**
   *  checks if there are any bad input in the input fields
   *  if there is add the proper css to show errors and preventDefault
   * 
   * @param event onClick event on submit button
   */
  function handle_submit(event: React.MouseEvent<HTMLButtonElement>){
    // check if name is entered
    if (name_ref.current!.value.length === 0){
      // show error message
      error_name_ref.current!.classList.add('error_status');
      name_ref.current!.classList.add('error');
      event.preventDefault();
    }else{
      // remove error message
      error_name_ref.current!.classList.remove('error_status');
      name_ref.current!.classList.remove('error');
    }

    // check if email is valid
    if (!email_valid){
      // show error message
      email_ref.current!.classList.add('error');
      error_email_ref.current!.classList.add('error_status');
      event.preventDefault();
    }else{
      // remove error message
      error_email_ref.current!.classList.remove('error_status');
      email_ref.current!.classList.remove('error');
    }

    // check if phone number is valid
    if (phone_ref.current!.value.length === 0 ||
        parseInt(phone_ref.current!.value) < 40000000 || parseInt(phone_ref.current!.value) > 49999999 ){
      // show error message
      phone_ref.current!.classList.add('error');
      error_phone_ref.current!.classList.add('error_status');
      event.preventDefault();
    }else{
      // remove error message
      phone_ref.current!.classList.remove('error');
      error_phone_ref.current!.classList.remove('error_status');
    }

    // check if areacode is valid
    if (!areacode_valid){
      // show error message
      areacode_ref.current!.classList.add('error');
      error_area_ref.current!.classList.add('error_status');
      event.preventDefault();
    }else{
      // remove error message
      areacode_ref.current!.classList.remove('error');
      error_area_ref.current!.classList.remove('error_status');
    }
    

  }
  
  
  return (
    <div id="App">
      <section>
        <form action="/back" method="post">
          <fieldset>
            <legend>Informasjon</legend>
            
            <label>Navn:</label>
            <input required type="text" name="name" placeholder="Ola Nordmann" ref={name_ref} onInput={handle_name_input} />
            <br/>
            <span className='error_msg' ref={error_name_ref} >vennligst skriv navn</span>
            <br/>

            <label>E-post:</label>
            <input required type="email" name="email" placeholder="navn@domene.no" onInput={handle_email_input} ref={email_ref} />
            <br/>
            <span className='error_msg' ref={error_email_ref} >ugyldig e-post</span>
            <br/>

            <label>Postnummer:</label>
            <input  required id="areacode" type="text" name="areacode" maxLength={4} size={4}
                    placeholder="1234" onInput={handle_areacode_input} ref={areacode_ref}/>
            <span id="area_name_span" ref={area_ref}></span>
            <br/>
            <span className='error_msg' ref={error_area_ref} >ugyldig Postnummer</span>
            <label>Telefon:</label>
            <input  required type="text" name="phone" maxLength={8} 
                    placeholder="XXX XX XXX" onInput={handle_phone_input} ref={phone_ref}/>
            <br/>
            <span className='error_msg' ref={error_phone_ref} >bruk mobilnummer <br/> 400 00 000 - 499 99 999  : 8-sifrede</span>
            <br/>
            <label>Kommentar:</label>
            <textarea required name="comment"></textarea>
            <br />
            <button type="submit" className='my_button' onClick={handle_submit}>Send inn!</button>
          </fieldset>
        </form>
      </section>
    </div>
  );
}

export default Inputs;
