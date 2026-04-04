import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import StepForm from './components/StepForm';
import ReduxStepForm from './components/ReduxStepForm';
import './App.css';

const TAB_HOOK_FORM = 'hookForm';
const TAB_REDUX = 'redux';

function App() {
  const [activeTab, setActiveTab] = useState(TAB_HOOK_FORM);

  return (
    <Provider store={store}>
      <div className="App">
        <div className="tab-container">
          <div className="tabs">
            <button
              className={`tab ${activeTab === TAB_HOOK_FORM ? 'active' : ''}`}
              onClick={() => setActiveTab(TAB_HOOK_FORM)}
            >
              React Hook Form 版
            </button>
            <button
              className={`tab ${activeTab === TAB_REDUX ? 'active' : ''}`}
              onClick={() => setActiveTab(TAB_REDUX)}
            >
              Redux 版
            </button>
          </div>

          <div className="tab-content">
            {activeTab === TAB_HOOK_FORM ? <StepForm /> : <ReduxStepForm />}
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;