import Enzyme from 'enzyme';
import EnzymeAdapter from 'enzyme-adapter-react-16';
import 'jest-canvas-mock';

Enzyme.configure({
  adapter: new EnzymeAdapter(),
  disableLifecycleMethods: true
});
