
import { useMemo, useState } from "react";

import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Eye,
  Mail,
  MailOpen,
  MessageSquare,
  RefreshCw,
  Trash2,
} from "lucide-react";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { toast } from "sonner";

import {
  deleteContactMessage,
  getContactMessages,
  updateContactReadStatus,
} from "@/api/contactApi";

import AdminPageHeader from "@/components/admin/AdminPageHeader";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

const filterOptions = [
  {
    value: "all",
    label: "All messages",
  },
  {
    value: "unread",
    label: "Unread",
  },
  {
    value: "read",
    label: "Read",
  },
];

const getStatusLabel = (status) => {
  switch (status) {
    case "new":
      return "New";

    case "in-progress":
      return "In Progress";

    case "resolved":
      return "Resolved";

    case "archived":
      return "Archived";

    default:
      return status || "Unknown";
  }
};

const getStatusVariant = (status) => {
  switch (status) {
    case "new":
      return "default";

    case "in-progress":
      return "secondary";

    case "resolved":
      return "outline";

    case "archived":
      return "secondary";

    default:
      return "secondary";
  }
};

const formatDate = (date) => {
  if (!date) {
    return "Unknown date";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Unknown date";
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
};

const formatShortDate = (date) => {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
};

const getInitials = (name) => {
  if (!name) {
    return "?";
  }

  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
};

const MessagesLoading = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Card key={index}>
          <CardContent className="p-5">
            <div className="flex gap-4">
              <Skeleton className="h-11 w-11 shrink-0 rounded-full" />

              <div className="min-w-0 flex-1 space-y-3">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-64 max-w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const EmptyMessages = ({ filter }) => {
  const isUnread = filter === "unread";
  const isRead = filter === "read";

  return (
    <Card>
      <CardContent className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          {isUnread ? (
            <MailOpen className="h-6 w-6 text-muted-foreground" />
          ) : (
            <MessageSquare className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <h3 className="text-base font-semibold">
          {isUnread
            ? "No unread messages"
            : isRead
              ? "No read messages"
              : "No messages yet"}
        </h3>

        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {isUnread
            ? "You have read all incoming messages."
            : isRead
              ? "There are no messages marked as read."
              : "Messages submitted through your portfolio contact form will appear here."}
        </p>
      </CardContent>
    </Card>
  );
};

const MessageCard = ({
  message,
  onOpen,
  onToggleRead,
  onDelete,
  isUpdating,
  isDeleting,
}) => {
  return (
    <Card
      className={`group overflow-hidden transition-colors ${
        !message.isRead ? "border-primary/30 bg-primary/[0.02]" : ""
      }`}
    >
      <CardContent className="p-5">
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
            {getInitials(message.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold">
                    {message.name}
                  </h3>

                  {!message.isRead && (
                    <Badge
                      variant="default"
                      className="h-5 px-1.5 text-[10px]"
                    >
                      New
                    </Badge>
                  )}
                </div>

                <p className="mt-0.5 truncate text-xs text-muted-foreground">
                  {message.email}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <Badge
                  variant={getStatusVariant(message.status)}
                  className="text-xs"
                >
                  {getStatusLabel(message.status)}
                </Badge>

                <span className="hidden text-xs text-muted-foreground sm:block">
                  {formatShortDate(message.createdAt)}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onOpen(message)}
              className="mt-4 block w-full text-left"
            >
              <p className="truncate text-sm font-medium">{message.subject}</p>

              <p className="mt-1 line-clamp-2 text-sm leading-6 text-muted-foreground">
                {message.message}
              </p>
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />

                <span>{formatDate(message.createdAt)}</span>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpen(message)}
                  className="h-8 gap-1.5 px-2.5"
                >
                  <Eye className="h-4 w-4" />

                  <span className="hidden sm:inline">View</span>
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isUpdating}
                  onClick={() => onToggleRead(message)}
                  className="h-8 gap-1.5 px-2.5"
                >
                  {message.isRead ? (
                    <>
                      <Mail className="h-4 w-4" />

                      <span className="hidden sm:inline">Unread</span>
                    </>
                  ) : (
                    <>
                      <MailOpen className="h-4 w-4" />

                      <span className="hidden sm:inline">Read</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => onDelete(message)}
                  className="h-8 px-2.5 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />

                  <span className="hidden sm:inline">Delete</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const MessageDetails = ({ message, onToggleRead, isUpdating }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
          {getInitials(message.name)}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold">{message.name}</h3>

            <Badge
              variant={getStatusVariant(message.status)}
              className="text-xs"
            >
              {getStatusLabel(message.status)}
            </Badge>

            <Badge
              variant={message.isRead ? "outline" : "default"}
              className="text-xs"
            >
              {message.isRead ? "Read" : "Unread"}
            </Badge>
          </div>

          <a
            href={`mailto:${message.email}`}
            className="mt-1 block truncate text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {message.email}
          </a>
        </div>
      </div>

      <Separator />

      <div className="space-y-5">
        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Subject
          </p>

          <p className="text-sm font-medium">{message.subject}</p>
        </div>

        <div>
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Message
          </p>

          <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-7">
            {message.message}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Received
            </p>

            <p className="text-sm">{formatDate(message.createdAt)}</p>
          </div>

          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last updated
            </p>

            <p className="text-sm">{formatDate(message.updatedAt)}</p>
          </div>
        </div>

        {message.repliedAt && (
          <div>
            <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Replied
            </p>

            <p className="text-sm">{formatDate(message.repliedAt)}</p>
          </div>
        )}
      </div>

      <Separator />

      <div className="flex flex-wrap justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={isUpdating}
          onClick={() => onToggleRead(message)}
          className="gap-2"
        >
          {message.isRead ? (
            <>
              <Mail className="h-4 w-4" />

              Mark as unread
            </>
          ) : (
            <>
              <MailOpen className="h-4 w-4" />

              Mark as read
            </>
          )}
        </Button>

        <Button
          type="button"
          className="gap-2"
          onClick={() => {
            window.location.href = `mailto:${message.email}?subject=${encodeURIComponent(
              `Re: ${message.subject}`,
            )}`;
          }}
        >
          <Mail className="h-4 w-4" />

          Reply
        </Button>
      </div>
    </div>
  );
};

const Messages = () => {
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState("all");
  const [selectedMessage, setSelectedMessage] = useState(null);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["contactMessages"],
    queryFn: getContactMessages,
  });

  const messages = data?.contacts || [];

  const unreadCount = useMemo(() => {
    return messages.filter((message) => !message.isRead).length;
  }, [messages]);

  const filteredMessages = useMemo(() => {
    switch (filter) {
      case "unread":
        return messages.filter((message) => !message.isRead);

      case "read":
        return messages.filter((message) => message.isRead);

      default:
        return messages;
    }
  }, [messages, filter]);

  const updateReadMutation = useMutation({
    mutationFn: ({ id, isRead }) => updateContactReadStatus(id, isRead),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["contactMessages"],
      });

      const updatedMessage = response?.contact;

      if (updatedMessage && selectedMessage?.id === updatedMessage.id) {
        setSelectedMessage(updatedMessage);
      }

      toast.success(
        updatedMessage?.isRead
          ? "Message marked as read"
          : "Message marked as unread",
      );
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message || "Failed to update message",
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteContactMessage,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["contactMessages"],
      });

      setSelectedMessage(null);

      toast.success("Message deleted successfully");
    },

    onError: (mutationError) => {
      toast.error(
        mutationError?.response?.data?.message || "Failed to delete message",
      );
    },
  });

  const handleOpenMessage = (message) => {
    setSelectedMessage(message);

    if (!message.isRead) {
      updateReadMutation.mutate({
        id: message.id || message._id,
        isRead: true,
      });
    }
  };

  const handleToggleRead = (message) => {
    const id = message.id || message._id;

    updateReadMutation.mutate({
      id,
      isRead: !message.isRead,
    });
  };

  const handleDeleteMessage = (message) => {
    const id = message.id || message._id;

    const confirmed = window.confirm(
      `Delete the message from ${message.name}? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteMutation.mutate(id);
  };

  const handleRefresh = () => {
    refetch();
  };

  const selectedMessageIsUpdating =
    updateReadMutation.isPending &&
    updateReadMutation.variables?.id ===
      (selectedMessage?.id || selectedMessage?._id);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Messages"
        description="Manage messages received through your portfolio contact form."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
              <MessageSquare className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">{messages.length}</p>

              <p className="text-sm text-muted-foreground">
                Total messages
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10">
              <Mail className="h-5 w-5 text-primary" />
            </div>

            <div>
              <p className="text-2xl font-bold">{unreadCount}</p>

              <p className="text-sm text-muted-foreground">
                Unread messages
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="hidden lg:block">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-muted">
              <CheckCircle2 className="h-5 w-5" />
            </div>

            <div>
              <p className="text-2xl font-bold">
                {messages.length - unreadCount}
              </p>

              <p className="text-sm text-muted-foreground">
                Read messages
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <DropdownMenu>
                {/* Base UI DropdownMenuTrigger already renders a button.
                    Do not nest the shadcn Button component inside it. */}
                <DropdownMenuTrigger
                  type="button"
                  variant="outline"
                  className="gap-2"
                >
                  {filterOptions.find((option) => option.value === filter)
                    ?.label || "All messages"}

                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start">
                  {filterOptions.map((option) => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => setFilter(option.value)}
                      className="gap-2"
                    >
                      {filter === option.value && (
                        <Check className="h-4 w-4" />
                      )}

                      <span
                        className={filter === option.value ? "" : "pl-6"}
                      >
                        {option.label}
                      </span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {filter === "unread" && unreadCount > 0 && (
                <Badge variant="secondary">
                  {unreadCount} unread
                </Badge>
              )}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              disabled={isFetching}
              className="w-fit gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
              />

              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {isLoading ? (
            <MessagesLoading />
          ) : isError ? (
            <Card className="border-destructive/30">
              <CardContent className="flex min-h-[280px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>

                <h3 className="font-semibold">
                  Failed to load messages
                </h3>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {error?.response?.data?.message ||
                    error?.message ||
                    "Something went wrong while loading your messages."}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleRefresh}
                  className="mt-4 gap-2"
                >
                  <RefreshCw className="h-4 w-4" />

                  Try again
                </Button>
              </CardContent>
            </Card>
          ) : filteredMessages.length === 0 ? (
            <EmptyMessages filter={filter} />
          ) : (
            <div className="space-y-3">
              {filteredMessages.map((message) => {
                const messageId = message.id || message._id;

                return (
                  <MessageCard
                    key={messageId}
                    message={message}
                    onOpen={handleOpenMessage}
                    onToggleRead={handleToggleRead}
                    onDelete={handleDeleteMessage}
                    isUpdating={
                      updateReadMutation.isPending &&
                      updateReadMutation.variables?.id === messageId
                    }
                    isDeleting={
                      deleteMutation.isPending &&
                      deleteMutation.variables === messageId
                    }
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(selectedMessage)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedMessage(null);
          }
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message details</DialogTitle>

            <DialogDescription>
              View the complete message and manage its read status.
            </DialogDescription>
          </DialogHeader>

          <MessageDetails
            message={selectedMessage}
            onToggleRead={handleToggleRead}
            isUpdating={selectedMessageIsUpdating}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Messages;
