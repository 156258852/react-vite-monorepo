import { useState } from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import StepForm from './components/StepForm';
import ReduxStepForm from './components/ReduxStepForm';
import StepFormV2 from './components/StepFormV2';
import './App.css';

const TAB_HOOK_FORM = 'hookForm';
const TAB_REDUX = 'redux';
const TAB_HOOK_FORM_V2 = 'hookFormV2';

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
            <button
              className={`tab ${activeTab === TAB_HOOK_FORM_V2 ? 'active' : ''}`}
              onClick={() => setActiveTab(TAB_HOOK_FORM_V2)}
            >
              Hook Form V2（单 Form + 嵌套路径）
            </button>
          </div>

          <div className="tab-content">
            {activeTab === TAB_HOOK_FORM && <StepForm />}
            {activeTab === TAB_REDUX && <ReduxStepForm />}
            {activeTab === TAB_HOOK_FORM_V2 && <StepFormV2 />}
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;
