export interface BranchByID {
    code:   number;
    status: string;
    branch: Branch;
}

export interface Branch {
    id:         number;
    name:       string;
    state_id:   number;
    created_at: Date;
    updated_at: Date;
    state:      State;
}

export interface State {
    id:          number;
    iso:         string;
    name:        string;
    description: string;
    created_at:  Date;
    updated_at:  Date;
}

// Update Branch
export interface UpdateBranch {
    status: string;
    code:   string;
    message: string;
}

// Delete Branch
export interface DeleteBranch {
    status: string;
    code:   string;
    message: string;
}