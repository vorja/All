import pocketbaseClient from '../utils/pocketbaseClient.js';
import { fetchProduccionByDate } from './agricolFetchService.js';
import { mapToIntegrationEvents } from './mappingService.js';
import { upsertIntegrationEvents } from './upsertService.js';

const INTEGRATION_KEY = "agricol_patacon_produccion";

const getTodayDate = () => new Date().toISOString().slice(0, 10);

const getState = async () => {
  try {
    return await pocketbaseClient
      .collection("integration_state")
      .getFirstListItem(`integration_key='${INTEGRATION_KEY}'`);
  } catch (_) {
    return null;
  }
};

const upsertState = async (payload) => {
  const state = await getState();
  if (!state) {
    return pocketbaseClient.collection("integration_state").create({
      integration_key: INTEGRATION_KEY,
      ...payload
    });
  }
  return pocketbaseClient.collection("integration_state").update(state.id, payload);
};

const runSync = async (requestedDate) => {
  const startedAt = Date.now();
  const state = await getState();
  const targetDate = requestedDate || state?.cursor_date || getTodayDate();

  const run = await pocketbaseClient.collection("integration_runs").create({
    integration_key: INTEGRATION_KEY,
    started_at: targetDate,
    status: "running"
  });

  try {
    const sourceData = await fetchProduccionByDate(targetDate);
    const events = mapToIntegrationEvents(sourceData, targetDate);
    const result = await upsertIntegrationEvents(events);
    const latency = Date.now() - startedAt;

    await pocketbaseClient.collection("integration_runs").update(run.id, {
      finished_at: getTodayDate(),
      registros_ok: result.ok,
      registros_error: result.failed,
      latencia_ms: latency,
      status: "ok"
    });

    await upsertState({
      cursor_date: targetDate,
      cursor_value: targetDate,
      last_status: "ok",
      last_error: ""
    });

    return {
      date: targetDate,
      events: events.length,
      ...result,
      latencyMs: latency
    };
  } catch (error) {
    const latency = Date.now() - startedAt;
    await pocketbaseClient.collection("integration_runs").update(run.id, {
      finished_at: getTodayDate(),
      registros_ok: 0,
      registros_error: 1,
      latencia_ms: latency,
      status: "error",
      error_msg: error.message
    });

    await upsertState({
      cursor_date: targetDate,
      cursor_value: targetDate,
      last_status: "error",
      last_error: error.message
    });

    throw error;
  }
};

export { runSync };
