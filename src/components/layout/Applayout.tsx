import React, { ReactNode } from "react";

type AppLayoutProps = {
  title?: string;
  navbar?: ReactNode;
  permissions?: string[];
  actionButtons?: ReactNode;
  children: ReactNode;
  className?: string;
  footer?: ReactNode;
};

const AppLayout: React.FC<AppLayoutProps> = ({
  title,
  navbar,
  permissions = [],
  actionButtons,
  className,
  children,
  footer,
}) => {
  const userPermissions = ["read", "write", "admin"];

  const hasPermission = permissions.every((perm) =>
    userPermissions.includes(perm)
  );

  if (!hasPermission) {
    return (
      <div className="flex h-screen items-center justify-center">
        <h1 className="text-xl font-bold text-red-500">
          You do not have the necessary permissions to view this page.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {navbar && <div>{navbar}</div>}

      <main className={`p-2 sm:p-4 min-h-screen dark:bg-gray-900 ${className}`}>
        {title && <h1 className="text-3xl  pr-10 font-bold mb-4">{title}</h1>}
        <div className="mb-4">{actionButtons}</div>
        <div>{children}</div>
      </main>

      {footer && <footer className="mt-4 bg-gray-200 py-4">{footer}</footer>}
    </div>
  );
};

export default AppLayout;
