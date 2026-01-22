import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PanelCard, PanelHeader, PanelProps, PanelSkeleton } from "./_Panel";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import SettingsNotification from "./_SettingsNotification";

type AccountSettings = {
  name: string;
  email: string;
  personalInfo: {
    company: string;
    phone: string;
  };
};

type AccountPanelProps = PanelProps<AccountSettings> & {
  onSave: (next: AccountSettings) => Promise<boolean>;
  onChangeEmail: (email: string) => Promise<boolean>;
  onChangePassword: () => Promise<boolean>;
  onSignOutAll: () => Promise<boolean>;
};

export default function AccountPanel({
  data,
  isLoading,
  error,
  onSave,
  onChangeEmail,
  onChangePassword,
  onSignOutAll,
}: AccountPanelProps) {
  const { t } = useTranslation();
  const [formState, setFormState] = useState<AccountSettings | null>(data);
  const [isSaving, setIsSaving] = useState(false);
  const [emailStep, setEmailStep] = useState<"idle" | "editing" | "sent">(
    "idle",
  );
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordState, setPasswordState] = useState({
    current: "",
    next: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (data) {
      setFormState(data);
      setPendingEmail(data.email);
      setEmailStep("idle");
    }
  }, [data]);

  const isDirty = useMemo(() => {
    if (!data || !formState) return false;
    return (
      data.name !== formState.name ||
      data.personalInfo.company !== formState.personalInfo.company ||
      data.personalInfo.phone !== formState.personalInfo.phone
    );
  }, [data, formState]);

  if (isLoading || !formState) {
    return <PanelSkeleton />;
  }

  const handlePasswordSubmit = async () => {
    setPasswordError(null);
    if (
      !passwordState.current ||
      !passwordState.next ||
      !passwordState.confirm
    ) {
      setPasswordError(
        t(
          "settings.password.error.allFields",
          "Please fill out all password fields.",
        ),
      );
      return;
    }
    if (passwordState.next.length < 8) {
      setPasswordError(
        t(
          "settings.password.error.minLength",
          "New password must be at least 8 characters.",
        ),
      );
      return;
    }
    if (passwordState.next !== passwordState.confirm) {
      setPasswordError(
        t("settings.password.error.mismatch", "Passwords do not match."),
      );
      return;
    }
    // Additional validation: check for common password patterns
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(passwordState.next)) {
      setPasswordError(
        t(
          "settings.password.error.weak",
          "Password must contain at least one uppercase letter, one lowercase letter, and one number.",
        ),
      );
      return;
    }
    setPasswordSaving(true);
    try {
      const success = await onChangePassword();
      if (success) {
        setPasswordState({ current: "", next: "", confirm: "" });
      }
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PanelHeader
        title={t("settings.account.title", "Account")}
        description={t(
          "settings.account.description",
          "Update your profile, email, and security settings.",
        )}
      />

      {error ? (
        <SettingsNotification
          title={t("settings.account.errorTitle", "Account data unavailable")}
          description={error}
          variant="destructive"
        />
      ) : null}

      <PanelCard>
        <PanelHeader
          title={t("settings.account.profile.title", "Profile")}
          description={t(
            "settings.account.profile.description",
            "Basic personal information.",
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="account-name">
              {t("settings.account.profile.name", "Name")}
            </Label>
            <Input
              id="account-name"
              value={formState.name}
              onChange={(event) =>
                setFormState({ ...formState, name: event.target.value })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-company">
              {t("settings.account.profile.company", "Company")}
            </Label>
            <Input
              id="account-company"
              value={formState.personalInfo.company}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  personalInfo: {
                    ...formState.personalInfo,
                    company: event.target.value,
                  },
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="account-phone">
              {t("settings.account.profile.phone", "Phone")}
            </Label>
            <Input
              id="account-phone"
              value={formState.personalInfo.phone}
              onChange={(event) =>
                setFormState({
                  ...formState,
                  personalInfo: {
                    ...formState.personalInfo,
                    phone: event.target.value,
                  },
                })
              }
            />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2 rtl:flex-row-reverse">
          <Button
            type="button"
            onClick={async () => {
              setIsSaving(true);
              await onSave(formState);
              setIsSaving(false);
            }}
            disabled={!isDirty || isSaving}
            data-testid="settings-save-account"
          >
            {isSaving
              ? t("settings.common.saving", "Saving...")
              : t("settings.account.profile.save", "Save profile")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setFormState(data)}
            disabled={!isDirty || isSaving}
          >
            {t("settings.common.reset", "Reset")}
          </Button>
        </div>
      </PanelCard>

      <PanelCard>
        <PanelHeader
          title={t("settings.account.email.title", "Email")}
          description={t(
            "settings.account.email.description",
            "Update your email address.",
          )}
        />
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3 text-sm text-neutral-600 dark:text-neutral-300 rtl:flex-row-reverse">
            <span>{t("settings.account.email.current", "Current email")}</span>
            <span className="font-medium text-neutral-900 dark:text-neutral-50">
              {formState.email}
            </span>
          </div>
          {emailStep === "editing" ? (
            <div className="space-y-2">
              <Label htmlFor="account-email">
                {t("settings.account.email.new", "New email")}
              </Label>
              <Input
                id="account-email"
                type="email"
                value={pendingEmail}
                onChange={(event) => setPendingEmail(event.target.value)}
              />
              <div className="flex flex-wrap items-center gap-2 rtl:flex-row-reverse">
                <Button
                  type="button"
                  onClick={async () => {
                    setEmailSaving(true);
                    const success = await onChangeEmail(pendingEmail);
                    setEmailSaving(false);
                    if (success) {
                      setEmailStep("sent");
                    }
                  }}
                  disabled={emailSaving || !pendingEmail}
                  data-testid="settings-change-email"
                >
                  {emailSaving
                    ? t("settings.account.email.sending", "Sending...")
                    : t(
                        "settings.account.email.sendConfirmation",
                        "Send confirmation",
                      )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setPendingEmail(formState.email);
                    setEmailStep("idle");
                  }}
                  disabled={emailSaving}
                >
                  {t("settings.common.cancel", "Cancel")}
                </Button>
              </div>
            </div>
          ) : emailStep === "sent" ? (
            <SettingsNotification
              title={t("settings.account.email.sentTitle", "Confirmation sent")}
              description={t(
                "settings.account.email.sentDescription",
                "Please check your inbox to confirm the new email.",
              )}
            />
          ) : (
            <Button
              type="button"
              variant="outline"
              onClick={() => setEmailStep("editing")}
              data-testid="settings-start-email-change"
            >
              {t("settings.account.email.change", "Change email")}
            </Button>
          )}
        </div>
      </PanelCard>

      <PanelCard>
        <PanelHeader
          title={t("settings.account.password.title", "Password")}
          description={t(
            "settings.account.password.description",
            "Update your password regularly.",
          )}
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="password-current">
              {t("settings.account.password.current", "Current password")}
            </Label>
            <Input
              id="password-current"
              type="password"
              value={passwordState.current}
              onChange={(event) =>
                setPasswordState({
                  ...passwordState,
                  current: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-new">
              {t("settings.account.password.new", "New password")}
            </Label>
            <Input
              id="password-new"
              type="password"
              value={passwordState.next}
              onChange={(event) =>
                setPasswordState({
                  ...passwordState,
                  next: event.target.value,
                })
              }
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password-confirm">
              {t("settings.account.password.confirm", "Confirm password")}
            </Label>
            <Input
              id="password-confirm"
              type="password"
              value={passwordState.confirm}
              onChange={(event) =>
                setPasswordState({
                  ...passwordState,
                  confirm: event.target.value,
                })
              }
            />
          </div>
        </div>
        {passwordError ? (
          <p className="text-sm text-red-500">{passwordError}</p>
        ) : null}
        <Button
          type="button"
          onClick={handlePasswordSubmit}
          disabled={passwordSaving}
          data-testid="settings-save-password"
        >
          {passwordSaving
            ? t("settings.account.password.updating", "Updating...")
            : t("settings.account.password.update", "Update password")}
        </Button>
      </PanelCard>

      <PanelCard>
        <PanelHeader
          title={t("settings.account.security.title", "Security")}
          description={t(
            "settings.account.security.description",
            "Additional actions for account safety.",
          )}
        />
        <ConfirmDialog
          triggerLabel={t(
            "settings.account.security.signOutAll",
            "Sign out of all devices",
          )}
          triggerVariant="destructive"
          title={t(
            "settings.account.security.signOutTitle",
            "Sign out everywhere",
          )}
          description={t(
            "settings.account.security.signOutDescription",
            "This will sign you out on all devices immediately.",
          )}
          confirmLabel={t("settings.account.security.signOut", "Sign out")}
          cancelLabel={t("settings.common.cancel", "Cancel")}
          onConfirm={onSignOutAll}
          dataTestId="settings-signout-all"
        />
      </PanelCard>
    </div>
  );
}
