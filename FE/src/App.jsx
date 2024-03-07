 
import './App.css'
import RouterData from './Routers';
// import Router from './Routers'
import { QueryClient, QueryClientProvider } from 'react-query'
import {store} from './store/index'
import { Provider } from "react-redux";
import { Helmet } from 'react-helmet';
function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 10
      }
    }
  })
  return (
    <>
      
    <Provider store={store()}>
     <QueryClientProvider client={queryClient}>
   
      <RouterData />
      </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App;
