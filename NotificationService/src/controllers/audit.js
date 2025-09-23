'use strict';

const store = require('../models/store');

class AuditController {
  // PUBLIC_INTERFACE
  list(req, res) {
    /** Query audit events with pagination.
     * Query params:
     * - limit: number (max 500)
     * - offset: number
     * Returns: { items, limit, offset, count }
     */
    const limitRaw = req.query && typeof req.query.limit === 'string' ? req.query.limit : '100';
    const offsetRaw = req.query && typeof req.query.offset === 'string' ? req.query.offset : '0';

    const limitNum = Number.parseInt(limitRaw, 10);
    const offsetNum = Number.parseInt(offsetRaw, 10);

    const limit = Number.isFinite(limitNum) ? Math.min(limitNum, 500) : 100;
    const offset = Number.isFinite(offsetNum) ? offsetNum : 0;

    const events = store.listAudit({ limit, offset });
    return res.json({
      items: events,
      limit,
      offset,
      count: events.length,
    });
  }
}

module.exports = new AuditController();
