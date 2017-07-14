class ContactsController < ApplicationController
  def index
    @contacts = Contact.all
    respond_to do |format|
      format.json { render json: {flash: flash} }
    end
  end

  def create
    @contact = Contact.new(contact_params)

    respond_to do |format|
      if @contact.save
        #using cookies so we can access ID via javascript
        cookies[:current_contact_id] = @contact.id

        flash[:notice] = "Contact '#{@contact.full_name}' added succesfully."

        find_project
        @project.contact = @contact
        @project.save
        #session[:current_contact_id] = @contact.id

        format.json { render json: { contact: @contact, flash: flash} }
      else
        format.json { render :json => { :errors => @contact.errors.messages }, :status => 422}
      end
    end
  end

  def update
    @contact = Contact.find(params[:id])
    respond_to do |format|
      if @contact.update_attributes(contact_params)
        #using cookies so we can access ID via javascript
        cookies[:current_contact_id] = @contact.id

        find_project
        @project.contact = @contact
        @project.save

        flash[:notice] = "Contact '#{@contact.full_name}' updated succesfully."
        format.json { render json: { contact: @contact, flash: flash} }
      else
        flash[:error] = "Contact '#{@contact.full_name}' failed to update."
        format.json { render :json => { :errors => @contact.errors.messages }, :status => 422}
      end
    end
  end

  def destroy
    @contact = Contact.find(params[:id])
    @contact.destroy
    flash[:notice] = "Contact '#{@contact.full_name}' deleted succesfully."
    respond_to do |format|
      format.json { render :json => {flash: flash, :redirect => "/contacts"} }
    end
  end

  def clear
    if cookies[:current_contact_id]
      cookies.delete :current_contact_id
      flash[:notice] = "Removed saved contact."
      respond_to do |format|
        format.json { render :json => {flash: flash} }
      end
    end
  end

  # def show
  #   @contact = Contact.find(params[:id])
  # end
  #
  # def new
  #   @contact = Contact.new
  # end
  #
  # def edit
  #   @contact = Contact.find(params[:id])
  # end

  private

    def contact_params
      params.require(:contact).permit(:first_name, :last_name, :email, :phone, :branch, :position, :avatar)
    end

    def find_project
      @project = Project.friendly.find(params[:project])
    end
end
