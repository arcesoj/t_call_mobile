import React, {useState} from 'react';
import VirtualSpace from './src/screens/VirtualSpace';
import Welcome from './src/screens/Welcome';

const App = () => {
  const [value, setValue] = useState('');

  return value.trim().length === 0 ? (
    <Welcome setValue={(text) => setValue(text)} />
  ) : (
    <VirtualSpace name={value} onLeave={() => setValue('')} />
  );
};

export default App;
