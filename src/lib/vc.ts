export const getConnectionCookieName = (caseParam: string) =>
  `conn_id_${caseParam}`;

export const getActiveConnectionCookieName = (caseParam: string) =>
  `active_conn_id_${caseParam}`;
