import { useState, useCallback } from "react";
import { getStoreData, setStoreData } from "./store";
import type { Task, Communication, Alert, Automation } from "./store";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => getStoreData<Task>("ops_tasks"));
  const refresh = useCallback(() => {
    setTasks(getStoreData<Task>("ops_tasks"));
  }, []);
  const save = useCallback((updated: Task[]) => {
    setStoreData("ops_tasks", updated);
    setTasks(updated);
  }, []);
  return { tasks, save, refresh };
}

export function useComms() {
  const [comms, setComms] = useState<Communication[]>(() => getStoreData<Communication>("ops_communications"));
  const refresh = useCallback(() => {
    setComms(getStoreData<Communication>("ops_communications"));
  }, []);
  const save = useCallback((updated: Communication[]) => {
    setStoreData("ops_communications", updated);
    setComms(updated);
  }, []);
  return { comms, save, refresh };
}

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(() => getStoreData<Alert>("ops_alerts"));
  const refresh = useCallback(() => {
    setAlerts(getStoreData<Alert>("ops_alerts"));
  }, []);
  const save = useCallback((updated: Alert[]) => {
    setStoreData("ops_alerts", updated);
    setAlerts(updated);
  }, []);
  return { alerts, save, refresh };
}

export function useAutomations() {
  const [autos, setAutos] = useState<Automation[]>(() => getStoreData<Automation>("ops_automations"));
  const refresh = useCallback(() => {
    setAutos(getStoreData<Automation>("ops_automations"));
  }, []);
  const save = useCallback((updated: Automation[]) => {
    setStoreData("ops_automations", updated);
    setAutos(updated);
  }, []);
  return { autos, save, refresh };
}
