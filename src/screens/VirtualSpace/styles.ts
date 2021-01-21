import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
  },
  navigationContainer: {
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  closeButton: {
    fontSize: 25,
    fontWeight: 'bold',
  },
  virtualContainer: {
    backgroundColor: 'white',
    flex: 1,
  },
});

export default styles;
