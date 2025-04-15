import env from 'env-var';
const config = {
    URL: env.get('URL').required().asUrlString(),
    PORT: env.get('PORT').required().asInt()
};
export default config;
