import React from 'react';

import Rotas from './rotas';
import Navbar from '../components/navbar';
import AuthProvider from './authProvider';

import 'toastr/build/toastr.min.js';

import 'bootswatch/dist/darkly/bootstrap.css';
import '../custom.css';
import 'toastr/build/toastr.css';
import 'primereact/resources/themes/arya-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

class App extends React.Component {
    render() {
        return (
            <AuthProvider>
                <Navbar />
                <div className="container">
                    <Rotas />
                </div>
            </AuthProvider>
        );
    }
}

export default App;
