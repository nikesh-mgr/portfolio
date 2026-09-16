import { Badge } from "@/components/ui/badge";

const ProjectStatusBadge = ({ status }) => {
  const statusConfig = {
    completed: {
      label: "Completed",
      variant: "default",
    },

    "in-progress": {
      label: "In Progress",
      variant: "secondary",
    },

    planned: {
      label: "Planned",
      variant: "outline",
    },
  };

  const config = statusConfig[status] || {
    label: "Unknown",
    variant: "outline",
  };

  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default ProjectStatusBadge;
