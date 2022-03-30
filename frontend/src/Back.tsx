import React from 'react';


function Back() {
  return (
    <div id="App">
        <section id="back_section">
            <form action='/' method='get'>
                <label>E-post Sendt!</label>
                <button className='my_button' type="submit" >Tilbake</button>
            </form>
        </section>
    </div>
  );
}

export default Back;
