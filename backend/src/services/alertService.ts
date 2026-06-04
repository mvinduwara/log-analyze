import { randomUUID } from "crypto";
import type { AlertRule, AlertEvent } from "../types";
import { getCurrentMetrics } from "./analyticsService";

class AlertService {
  private rules: AlertRule[] = [];
  private events: AlertEvent[] = [];

  addRule(rule: Omit<AlertRule, "id" | "createdAt">): AlertRule {
    const newRule: AlertRule = {
      ...rule,
      id: randomUUID(),
      createdAt: new Date().toISOString(),
    };
    this.rules.push(newRule);
    return newRule;
  }

  deleteRule(id: string): boolean {
    const before = this.rules.length;
    this.rules = this.rules.filter((r) => r.id !== id);
    return this.rules.length < before;
  }

  getRules(): AlertRule[] {
    return this.rules;
  }

  getEvents(): AlertEvent[] {
    return this.events.slice(-200);
  }

  evaluate(): AlertEvent[] {
    const metrics = getCurrentMetrics();
    const triggered: AlertEvent[] = [];

    for (const rule of this.rules) {
      if (!rule.enabled) continue;
      const value = metrics[rule.metric as keyof typeof metrics] ?? 0;
      const fires =
        rule.operator === "gt" ? value > rule.threshold : value < rule.threshold;
      if (fires) {
        const event: AlertEvent = {
          id: randomUUID(),
          ruleId: rule.id,
          ruleName: rule.name,
          metric: rule.metric,
          value,
          threshold: rule.threshold,
          triggeredAt: new Date().toISOString(),
        };
        this.events.push(event);
        triggered.push(event);
      }
    }
    return triggered;
  }
}

export const alertService = new AlertService();