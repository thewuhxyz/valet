export const styleSheet = `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Inter:ital,wght@400&display=swap');

        #valet-ota-injected-modal {
          font-family: 'Inter', sans-serif;
          position: fixed;
          top: 0;
          right: 0;
          width: 100%;
          height: 100%;
          padding: 0px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-sizing: border-box
        }
        
        .italic {
          font-style: italic;
        }
        
        .valet-ota-popup {
          position: fixed;
	        top: 0;
	        right: 0;
	        width: 360px;
	        height: 600px;
	        background-color: hsl(240 10% 3.9%);
          color: hsl(0 0% 98%);
	        padding: 8px;
          margin: 16px;
	        display: flex;
	        flex-direction: column;
	        align-items: center;
	      }

        .valet-ota-popup-header {
          padding: 16px 0px;
        }

        .valet-ota-popup-body {
          padding: 16px 0px;
          display: flex;
          flex-direction: column;
        }  
        
        .valet-ota-popup-body-profile-bar {
          text-align: center;
        }
        
        .valet-ota-popup-body-message-area {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 16px;
          font-size: 14px;
          line-height: 1.5;
        }

        .valet-ota-popup-body-action-area {
          width: 100%;
        }
        
        .valet-ota-popup-body-action-area input {
          width: 100%;
        }

        .valet-ota-popup-profile-image {
          width: 100px;
          height: 100px;
        }

        .valet-ota-popup-footer {
          width: 100%;
          padding: 4px 0px;
          display: flex;
	        flex-direction: column;
          align-items: center;
        }

        
        .valet-ota-popup-footer input {
          font-size: 16px;
          width: 100%;
          margin: 8px;
          padding: 8px;
          border-radius: 0.375rem;
          background-color: hsl(240 10% 3.9%);
          color: hsl(0 0% 98%); 
        }

        .valet-ota-popup-footer .checkbox-container {
          display: flex;
          width: 100%;
        }

        .flex-1 {
          flex: 1; 
        }

        .remove {
          display: none;
        }

        .valet-ota-popup-footer button {
          padding: 6px;
          margin: 4px;
          display: inline-flex; 
          align-items: center; 
          justify-content: center; 
          border-radius: 0.375rem;
          font-size: 0.875rem;
          font-weight: 500; 
          white-space: nowrap; 
          transition-property: color; 
          transition-duration: 150ms;
        }

        .valet-ota-popup-footer button:focus-visible {
          outline: none; 
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
        }
        
        .valet-ota-popup-footer button:hover {
          opacity: 0.9;
        }

        .valet-ota-popup-footer button:disabled {
          pointer-events: none;
          opacity: 0.5;
        }
        
        .valet-ota-popup-footer .full-width {
          width: 100%;
        }
        
        .valet-ota-popup-footer .invisible {
          background-color: hsl(240 10% 3.9%);
          color: hsl(0 0% 98%); 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
          opacity: 0.4;
        }
        
        .valet-ota-popup-footer .visible {
          background-color: hsl(240 10% 3.9%);
          color: hsl(0 0% 98%); 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        
        .valet-ota-popup-footer .approve {
          background-color: hsl(0 0% 98%);
          color: hsl(240 5.9% 10%); 
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .valet-ota-popup-footer .cancel {
          background-color: hsl(0 62.8% 30.6%);
          color: hsl(0 85.7% 97.3%);
          box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
      `
