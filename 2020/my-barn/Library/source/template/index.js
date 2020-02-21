(function (namespace, name) {
    var module = {
        Dom: null,
        isVisible: true,
        getIframe: function () {
            var iframe = document.createElement("iframe");
            var tempURL = window["Edbox"].SetQueryString("EdboxArgs", window["Edbox"].GetLoginInfo(), window["Edbox"].Protocol + "://" + window["Edbox"].GetHost("Component") + "/coms/Library/index.html");
            iframe.setAttribute("src", tempURL);
            iframe.setAttribute("id", "Library_Iframe");
            iframe.style.top = "0";
            iframe.style.zIndex = "999";
            iframe.style.left = "0";
            iframe.style.position = "fixed";
            iframe.style.width = "100%";
            iframe.style.height = "100%";
            iframe.style.borderWidth = "0px";
            return iframe;
        },
        hideLibrary: null,
        Init: function (initOk) {
            var iframe = this.getIframe();
            this.Dom = iframe;
            document.body.appendChild(iframe);
            if (!this.hideLibrary) {
                this.hideLibrary = function (e) {
                    // @ts-ignore
                    e.data === "HideLibrary" && (this.Dom.style.display = "none");
                }.bind(this);
            }
            window.addEventListener("message", this.hideLibrary);
            if (typeof initOk === "function")
                initOk();
        },
        Show: function () {
            if (this.isVisible) {
                this.Dom.style.display = "none";
                this.isVisible = false;
                return;
            }
            if (!this.isVisible) {
                this.Dom.style.display = "block";
                this.isVisible = true;
            }
        },
        Start: function (initOk) {
            if (typeof initOk === "function")
                initOk();
        },
        Dispose: function (isOk) {
            this.Dom && document.body.removeChild(this.Dom);
            this.hideLibrary && window.removeEventListener("message", this.hideLibrary);
            if (typeof isOk === "function")
                isOk();
        }
        // StartMessageTest() {
        //     log("startMessagetest");
        // }
    };
    if (namespace && name && !namespace[name]) {
        namespace[name] = module;
    }
})(window["Edbox"], "Library");
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxDQUFDLFVBQVMsU0FBUyxFQUFFLElBQUk7SUFDckIsSUFBSSxNQUFNLEdBQUc7UUFDVCxHQUFHLEVBQUUsSUFBSTtRQUNULFNBQVMsRUFBRSxJQUFJO1FBQ2YsU0FBUyxFQUFFO1lBQ1AsSUFBSSxNQUFNLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUM5QyxJQUFJLE9BQU8sR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsY0FBYyxDQUN4QyxXQUFXLEVBQ1gsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksRUFBRSxFQUM5QixNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxHQUFHLEtBQUssR0FBRyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxHQUFHLDBCQUEwQixDQUN2RyxDQUFDO1lBQ0YsTUFBTSxDQUFDLFlBQVksQ0FBQyxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDcEMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztZQUM1QyxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsS0FBSyxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztZQUN4QixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUM7WUFDaEMsTUFBTSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDO1lBQzVCLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztZQUM3QixNQUFNLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxLQUFLLENBQUM7WUFDakMsT0FBTyxNQUFNLENBQUM7UUFDbEIsQ0FBQztRQUNELFdBQVcsRUFBRSxJQUFJO1FBQ2pCLElBQUksRUFBRSxVQUFTLE1BQU07WUFDakIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxHQUFHLEdBQUcsTUFBTSxDQUFDO1lBQ2xCLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ2xDLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNuQixJQUFJLENBQUMsV0FBVyxHQUFHLFVBQVMsQ0FBQztvQkFDekIsYUFBYTtvQkFDYixDQUFDLENBQUMsSUFBSSxLQUFLLGFBQWEsSUFBSyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUMsQ0FBQztnQkFDbkUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzthQUNoQjtZQUNELE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1lBQ3JELElBQUksT0FBTyxNQUFNLEtBQUssVUFBVTtnQkFBRSxNQUFNLEVBQUUsQ0FBQztRQUMvQyxDQUFDO1FBQ0QsSUFBSSxFQUFFO1lBQ0YsSUFBSSxJQUFJLENBQUMsU0FBUyxFQUFFO2dCQUNoQixJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDO2dCQUNoQyxJQUFJLENBQUMsU0FBUyxHQUFHLEtBQUssQ0FBQztnQkFDdkIsT0FBTzthQUNWO1lBQ0QsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUU7Z0JBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Z0JBQ2pDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO2FBQ3pCO1FBQ0wsQ0FBQztRQUNELEtBQUssRUFBRSxVQUFTLE1BQU07WUFDbEIsSUFBSSxPQUFPLE1BQU0sS0FBSyxVQUFVO2dCQUFFLE1BQU0sRUFBRSxDQUFDO1FBQy9DLENBQUM7UUFDRCxPQUFPLEVBQUUsVUFBUyxJQUFJO1lBQ2xCLElBQUksQ0FBQyxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2hELElBQUksQ0FBQyxXQUFXLElBQUksTUFBTSxDQUFDLG1CQUFtQixDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDNUUsSUFBSSxPQUFPLElBQUksS0FBSyxVQUFVO2dCQUFFLElBQUksRUFBRSxDQUFDO1FBQzNDLENBQUM7UUFDRCx1QkFBdUI7UUFDdkIsK0JBQStCO1FBQy9CLElBQUk7S0FDUCxDQUFDO0lBQ0YsSUFBSSxTQUFTLElBQUksSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ3ZDLFNBQVMsQ0FBQyxJQUFJLENBQUMsR0FBRyxNQUFNLENBQUM7S0FDNUI7QUFDTCxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEVBQUUsU0FBUyxDQUFDLENBQUMifQ==