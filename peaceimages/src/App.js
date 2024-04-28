import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [prompt, setPrompt] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const createImg = async () => {
    setIsLoading(true);
    try {
      setImageURL('');
      const response = await axios.post(
        'https://api.openai.com/v1/images/generations',
        {
          model: 'dall-e-3',
          prompt,
          n: 1,
          size: '1024x1024',
        },
        {
          headers: {
            'Authorization': `Bearer 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`
          }
        }
      );
      setImageURL(response.data.data[0].url);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate image');
    }
    setIsLoading(false);
  };

  const handleChange = (e) => {
    setPrompt(e.target.value);
  };

  return (
    <div className="container-fluid" style={{ backgroundColor: '#444', minHeight: '100vh', padding: '25px' }}>
      <div className="form" style={{ textAlign: 'center' }}>
        <h1 style={{ color: '#FFF' }}>Art of peace!</h1>
        <p style={{ color: '#FFF' }}>A fantastic bright image of peace with the text slogan "Declare Peace Every Day"</p>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Enter your image description"
          style={{ width: '450px', padding: '5px 10px' }}
        />
        <button
          style={{ color: '#FFF', backgroundColor: '#00F', border: 'none', cursor: 'pointer', padding: '8px 15px 7px 15px', marginLeft: '5px' }}
          type="submit"
          className="btn btn-primary"
          onClick={createImg}
          disabled={isLoading}
        >
          {isLoading ? 'Loading...' : 'Submit'}
        </button>
        {imageURL && <img style={{ marginTop: '25px', width: '100%', maxWidth: '100%' }} src={imageURL} alt="Generated" />}
      </div>
    </div>
  );
}

export default App;
