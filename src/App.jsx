import React from 'react';
import { HashRouter as Router, Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import ReactPlaceholder from 'react-placeholder';
import { RectShape, RoundShape } from 'react-placeholder/lib/placeholders';
import TopMenu from './components/TopMenu';
import Home from './routes/Homes/Home';
import Todo from './routes/Todo/TodoApp';
import About from './routes/About';
import NotFound from './routes/NotFound';

import './styles/app.less';

const ChartPlaceholder = (
  <div style={{ padding: 16 }}>
    <RoundShape style={{ margin: '0 auto', width: 400, height: 26 }} />
    <RectShape style={{ height: 300, marginTop: 20 }} />
  </div>
);

const Chart = Loadable({
  loader: () => import(/* webpackChunkName:'chart' */'./routes/Chart/chart'),
  loading: () => <ReactPlaceholder customPlaceholder={ChartPlaceholder} ready={false}> </ReactPlaceholder>,
});

class App extends React.PureComponent {
  render() {
    return (
      <Router>
        <div className="f-dfc">
          <TopMenu />
          <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/home" component={Home} />
            <Route path="/todo" component={Todo} />
            <Route path="/chart" component={Chart} />
            <Route path="/about" component={About} />
            <Route path="*" component={NotFound} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
