import NodeCache from 'node-cache';

// Standard cache with 5 minutes (300 seconds) standard TTL, and a check period of 120s
const cache = new NodeCache({ stdTTL: 300, checkperiod: 120 });

export default cache;
