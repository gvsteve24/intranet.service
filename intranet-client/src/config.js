const dev = {
    ORIGIN: 'http://localhost:3000'
};

const prod = {
    ORIGIN: 'https://steve24-intranet-service.herokuapp.com'
};

const config = process.env.REACT_APP_STAGE === 'production' ? prod : dev;

export default {
    ...config
};