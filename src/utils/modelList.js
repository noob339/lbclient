export async function getModelList(signal) {
  let response;

  try {
    response = await fetch('/model-list', { method: 'GET', signal, cache: 'no-store' });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('Could not reach the model-list server. Please check that the backend is running.', { cause: error });
  }

  if (response.status !== 200) {
    throw new Error(`Could not retrieve models (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`);
  }

  let models;
  try {
    models = await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new Error('The model-list server did not return a JSON array of model names.', { cause: error });
  }

  // Guard the response shape so an unfinished endpoint cannot break the menu.
  if (!Array.isArray(models) || models.some((model) => typeof model !== 'string' || !model.trim())) {
    throw new Error('The model-list server did not return a JSON array of model names.');
  }

  return [...new Set(models)];
}
